import React from 'react';
import { DownloadIcon } from 'lucide-react';
import { useState, useRef, useEffect } from "react";
interface CompileTxtButtonProps {
  reportText: string;
  totalTokens1: string;
  nameChat1: string;
  fileName?: string;
}
const CompileTxtButton2: React.FC<CompileTxtButtonProps> = ({
  reportText,
  totalTokens1,
  nameChat1,
  fileName = 'research_report.txt'
}) => {
  {/*  Tomo la investigacion y la uso aqui  */}
  const [content, setContent] = useState(reportText ?? "");
  const [shouldUpdatePDF, setShouldUpdatePDF] = useState(false);
  useEffect(() => {
    if (content) {
      const timer = setTimeout(() => {
        setShouldUpdatePDF(true);
      }, 2000); // Espera 2 segundos después del último cambio

      return () => clearTimeout(timer);
    }
  }, [content]);
  useEffect(() => {
    if (shouldUpdatePDF) {
      updatePDF();
      setShouldUpdatePDF(false);
    }
  }, [shouldUpdatePDF]);
  const updatePDF = async () => {
    const encodedText = encodeURIComponent(content.replace(/°/g, "\\textdegree "));
    //const latexUrl = `https://latexonline.cc/compile?text=${encodedText}`;
    // Nuestro servidor ---
    const latexUrl = `https://mmatex.fly.dev/compile?text=${encodedText}`;
    const pdfContainer = document.getElementById("pdf-container2");
    if (pdfContainer) {
      // Paso 1: Mostrar el spinner
      pdfContainer.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <div class="spinner"></div>
          <p>Espere, su PDF ya está siendo procesado</p>
        </div>
      `;

      // Paso 2: Agregar el estilo del spinner
      const style = document.createElement("style");
      style.innerHTML = `
        .spinner {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 2s linear infinite;
          margin: 0 auto 10px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      // Paso 3: Insertar el PDF después de un retraso
      setTimeout(() => {
        pdfContainer.innerHTML = `
          <div>
            <object data="${latexUrl}" type="application/pdf" width="103%" height="550px">
              <p>Algo salió mal! <a href="${latexUrl}">con el PDF!</a></p>
            </object>
          </div>
        `;
      }, 1000); // Retraso de 1 segundo
    }
  };
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };
  return <div className="container py-0 space-y-0">
      <div id="pdf-container2" className="w-full"></div>
    </div>;
};
export default CompileTxtButton2;