// app/api/get-github-sha/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Obtener parámetros de la query string
    const owner = req.nextUrl.searchParams.get('owner');
    const repo = req.nextUrl.searchParams.get('repo');
    const path = req.nextUrl.searchParams.get('path');
    const authToken = req.nextUrl.searchParams.get('authToken');

    // Validación de parámetros
    if (!owner || !repo || !path || !authToken) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos (owner, repo, path, authToken)' },
        { status: 400 }
      );
    }

    // Construir la URL del API endpoint
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    console.log('URL being requested:', url);

    // Configurar los headers para la solicitud
    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Accept': 'application/vnd.github.v3+json',
    };

    // Hacer la solicitud HTTP
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Devolver solo el SHA (o más información si lo deseas)
    return NextResponse.json(
      { 
        sha: data.sha,
        url: url 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al obtener el SHA del archivo:', error);
    return NextResponse.json(
      { error: 'Error al obtener el SHA del archivo' },
      { status: 500 }
    );
  }
}