"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui2/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui2/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui2/card";
import { Download, Copy, Code, Eye, Search } from "lucide-react";
// Las cosas de Monaco --
import { languages } from 'monaco-editor';
import { editor } from 'monaco-editor';
import Editor from '@monaco-editor/react';
import { ToastContainer, toast } from 'react-toastify';
// Las cosas del GitHub --
import { getGitHubSHA } from '@/components/chat/getSHA_github';

// -----------------------------------------
// --- Para guardar los chats --------------
import { useSession } from 'next-auth/react';
const PDFendpoints = ['https://latexonline.cc', 'https://mmatex.fly.dev'];

// Función para seleccionar un endpoint aleatorio
const getRandomEndpoint = () => {
  const randomIndex = Math.floor(Math.random() * PDFendpoints.length);
  return PDFendpoints[randomIndex];
};
interface LaTeXEditorTxtProps {
  reportText: string;
  totalTokens: string;
  nameChat: string;
}
const LaTeXEditorTxt: React.FC<LaTeXEditorTxtProps> = ({
  reportText
}) => {
  {/* Temas de sesion de usuario */}
  const {
    data: session,
    update
  } = useSession();
  const userId = session?.user?.id;
  {/*  Tomo la investigacion y la uso aqui  */}
  const [content, setContent] = useState(reportText ?? "");
  const [lines, setLines] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const saveChatEntryNotify = () => toast("Success! Document saved successfully!");
  const noSaveChatEntryNotify = () => toast("Something went wrong! Please try again.");

  // --------------------------------------------------------------------
  // Para el SHA GitHUB -----------------------------------------------
  // Dentro de tu componente LaTeXEditorTxt
  // --------------------------------------------------------------------
  const [sha, setSha] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const credentialsGitHub = {
    owner: 'valor1b',
    repo: 'valor2b',
    path: 'valor3b',
    authToken: 'valor4b'
  };
  const handleClickGitHub = async () => {
    const result = await getGitHubSHA(credentialsGitHub);
    setSha(result.sha);
    setError(result.error);
  };

  // --------------------------------------------------------------------
  // Para el buscador -----------------------------------
  // Dentro de tu componente LaTeXEditorTxt
  // --------------------------------------------------------------------
  const handleSearch = () => {
    if (editorRef.current) {
      const editor = editorRef.current;

      // Obtener el modelo del editor
      const model = editor.getModel();
      if (model) {
        // Buscar coincidencias de 'd' (puedes cambiar 'd' por otro texto)
        const matches = model.findMatches('d', true, false, false, null, true);
        if (matches.length > 0) {
          // Seleccionar la primera coincidencia
          const range = matches[0].range;
          editor.setSelection(range);
          editor.revealRangeInCenter(range); // Centrar la vista en la coincidencia
        }
      }

      // Abrir el widget de búsqueda de Monaco
      editor.getAction('actions.find').run();
    }
  };
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------

  {/* Para refrescar el valor si vuelvo a preguntar  */}
  useEffect(() => {
    setContent(reportText);
  }, [reportText]);
  useEffect(() => {
    // Split content into lines
    setLines(content.split("\n"));
  }, [content]);

  // Guardar la posición de desplazamiento cuando cambia
  const handleScroll = () => {
    if (editorContainerRef.current) {
      setScrollPosition(editorContainerRef.current.scrollTop);
    } else if (previewContainerRef.current) {
      setScrollPosition(previewContainerRef.current.scrollTop);
    }
  };

  // Restaurar la posición de desplazamiento cuando cambia la pestaña
  const handleTabChange = (value: string) => {
    // Guardar la posición actual antes de cambiar
    if (value === "editor" && previewContainerRef.current) {
      setScrollPosition(previewContainerRef.current.scrollTop);
    } else if (value === "preview" && editorContainerRef.current) {
      setScrollPosition(editorContainerRef.current.scrollTop);
    }

    // Restaurar la posición después del cambio
    setTimeout(() => {
      if (value === "editor" && editorContainerRef.current) {
        editorContainerRef.current.scrollTop = scrollPosition;
        // Prevenir que el foco cause desplazamiento
        if (textareaRef.current) {
          const selStart = textareaRef.current.selectionStart;
          const selEnd = textareaRef.current.selectionEnd;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(selStart, selEnd);
        }
      } else if (value === "preview" && previewContainerRef.current) {
        previewContainerRef.current.scrollTop = scrollPosition;
      }
    }, 10);
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Manejar los cambios en el contenido del editor
  const handleEditorChange = () => {
    const newValue = editorRef.current?.getValue();
    if (newValue !== undefined) {
      setContent(newValue);
    }
  };
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = "document.tex";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const updatePDF = async () => {
    const PDFendpoint = getRandomEndpoint();
    const encodedText = encodeURIComponent(content.replace(/°/g, "\\textdegree "));
    //const latexUrl = `${PDFendpoint}/compile?text=${encodedText}`
    // Nuestro servidor ---
    try {
      const latexUrl = `${PDFendpoint}/compile?text=${encodedText}`;

      // -- Esto va a esperar por los documentos grandes ..
      // -- Tenemos que guardar content en GitHub, actualizar el archivo
      // -- y luego compilar.
      //const fileGitHub = credentialsGitHub.owner+"/"+credentialsGitHub.repo+"&target="+credentialsGitHub.path;
      //const latexUrl = `https://latexonline.cc/compile?git=https://github.com/${fileGitHub}`

      const pdfContainer = document.getElementById("pdf-container2");
      if (pdfContainer) {
        pdfContainer.innerHTML = `<div>
        <object data=${latexUrl} type="application/pdf" width="105%" height="550px">
          <p>Algo salio mal! <a href=${latexUrl}>con el PDF!</a></p>
        </object>
      </div>`;
      }
    } catch (error) {
      console.error('Error final:', error);
    }
  };

  // Simple syntax highlighting function
  const highlightLatex = (text: string) => {
    return text.replace(/\\\\([a-zA-Z]+)/g, '<span class="text-blue-500">\\$1</span>') // Commands
    .replace(/\{([^}]*)\}/g, '{<span class="text-green-600">$1</span>}') // Braces content
    .replace(/\$\$(.*?)\$\$/g, '<span class="text-purple-500">$$$$1$$</span>') // Display math
    .replace(/\$(.*?)\$/g, '<span class="text-purple-500">$$$1$$</span>') // Inline math
    .replace(/\\begin\{([^}]*)\}/g, '<span class="text-red-500">\\begin{$1}</span>') // Begin environments
    .replace(/\\end\{([^}]*)\}/g, '<span class="text-red-500">\\end{$1}</span>'); // End environments
  };

  // -------------------------------------------------------
  // --- Para guardar los chats ----------------------------
  const saveChatEntry = async () => {
    function generarStringAleatorio() {
      const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let resultado = '';
      for (let i = 0; i < 15; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      }
      return resultado;
    }
    function extraerPrimerosQuinceCaracteresDePrimeraSeccion(contenido) {
      // Buscar la primera aparición de \section{...}
      const regexPrimeraSeccion = /\\section\{([^}]*)\}/;
      const match = contenido.match(regexPrimeraSeccion);
      if (!match) {
        return "No se encontró ninguna sección.";
      }

      // Encontrar la posición donde termina el comando \section{...}
      const finComando = match.index + match[0].length;

      // Encontrar el final de la sección
      const inicioSiguienteSeccion = contenido.indexOf('\\section', finComando);
      const finDocumento = contenido.indexOf('\\end{document}', finComando);
      let finSeccion;
      if (inicioSiguienteSeccion === -1 || finDocumento < inicioSiguienteSeccion) {
        finSeccion = finDocumento; // Si no hay más secciones, termina en \end{document}
      } else {
        finSeccion = inicioSiguienteSeccion; // Termina en la siguiente sección
      }

      // Extraer el contenido de la sección y limpiarlo
      const contenidoSeccion = contenido.substring(finComando, finSeccion).trim();

      // Tomar los primeros quince caracteres
      return contenidoSeccion.substring(0, 15);
    }
    const tokensUsed = Number("234");
    //const nameChat = generarStringAleatorio()
    const nameChat = extraerPrimerosQuinceCaracteresDePrimeraSeccion(content);
    try {
      const response = await fetch('/api/save-chatentry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nameChat,
          content,
          tokensUsed,
          userId
        })
      });
      if (!response.ok) {
        throw new Error('Error al guardar la entrada');
      }
      const data = await response.json();
      console.log(data.message); // "Entrada guardada exitosamente"
      saveChatEntryNotify();
    } catch (error) {
      console.error('Error:', error);
      noSaveChatEntryNotify();
    }
  };
  return <Card className="w-full max-w-7xl mx-auto max-h-[550px] overflow-auto">
      <CardHeader>
        <CardTitle>MMaTEX Advanced Editor</CardTitle>
        <CardDescription>Edit your research document here</CardDescription>
      </CardHeader>



      <Tabs defaultValue="editor" onValueChange={handleTabChange}>
        <TabsList className="mx-6">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Code className="h-4 w-4" />Editor</TabsTrigger>

          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />Compile</TabsTrigger>

        {/* ----- Boton de buscar ---------------------*/}
    <Button variant="outline" size="sm" onClick={handleSearch} style={{
          marginLeft: 'auto'
        }}>
      <Search className="h-4 w-4 mr-2" />Search</Button>
        {/*--------------------------------------------*/}


        </TabsList>

        <CardContent>
          <TabsContent value="editor" className="mt-0">
            <div className="border rounded-md overflow-hidden overflow-y-auto" ref={editorContainerRef} onScroll={handleScroll}>

              <div className="flex">


              <Editor height="55vh" language="latex" theme="latexTheme" value={content} onMount={(editor, monaco) => {
                editorRef.current = editor; // Guardamos la instancia del editor
                monaco.languages.setMonarchTokensProvider('latex', {
                  tokenizer: {
                    root: [[/\\[a-zA-Z]+/, 'keyword'],
                    // Comandos como \section
                    [/\{/, 'delimiter'],
                    // Llaves de apertura
                    [/\}/, 'delimiter'],
                    // Llaves de cierre
                    [/\$(?!\$)/, {
                      token: 'string',
                      next: '@math'
                    }],
                    // Matemáticas en línea
                    [/\%.*$/, 'comment'] // Comentarios
                    ],
                    math: [[/(?<!\$)\$(?!\$)/, {
                      token: 'string',
                      next: '@pop'
                    }] // Salir del modo matemático
                    ]
                  }
                });
                monaco.editor.setTheme('hc-black');
                editor.onDidChangeModelContent(handleEditorChange); // Escuchamos los cambios
              }} options={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 18,
                lineHeight: 24,
                wordWrap: 'on',
                minimap: {
                  enabled: false
                },
                padding: {
                  top: 10
                }
              }} />
              </div>
            </div>
          </TabsContent>


        </CardContent>
      </Tabs>


      <CardFooter className="flex flex-col gap-2">
        <div className="w-full flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {lines.length}lines |{content.length}characters</div>
          <div className="flex gap-2">
          
          {/* Boton de Compilar PDF(corto) */}
            <Button variant="outline" size="sm" onClick={() => {
            updatePDF();
            saveChatEntry();
          }}>
                <Copy className="h-4 w-4 mr-2" />Update PDF</Button>

          {/* Boton de descarga */}
            <Button variant="default" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />Download .tex</Button>

          {/* Boton de Compilar(grandes) 
           <div>
            <button onClick={handleClickGitHub}>Obtener SHA</button>
            {sha && <p>SHA: {sha}</p>}
            {error && <p>Error: {error}</p>}
           </div>*/}

          </div>
        </div>

      </CardFooter>
    </Card>;
};
export default LaTeXEditorTxt;