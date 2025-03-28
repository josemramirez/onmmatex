"use client";

import { useState, useEffect } from "react";
import { Message } from "ai";
import { motion } from "framer-motion";
import { GithubIcon, PanelRightOpen } from "lucide-react";
import { Feather, Mic } from 'lucide-react';
import { useScrollToBottom } from "@/lib/hooks/use-scroll-to-bottom";
{/*-- Mi boton de compilar --*/}
import CompileTxtButton2 from "@/components/chat/compile-txt2";
import { MultimodalInput } from "@/components/chat/input2";
import { PreviewMessage, ProgressStep } from "@/components/chat/message";
import { ResearchProgress } from "@/components/chat/research-progress";
{/* Para el lateX Editor */}
import dynamic from 'next/dynamic';
const LaTeXEditorTxt = dynamic(() => import('@/components/chat/latex-editor'), {
  ssr: false // Desactiva el SSR
});
// -----------------------------------------
// --- Para guardar los chats --------------
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import AtomWithCounter from "@/components/chat/atomloader";
import { useChatContext } from "@/components/context/ChatContext";

// Define las props que Chat recibirá
interface ChatProps {
  id: string;
  initialMessages: any[];
  setTotalTokens: (value: string) => void;
  setTotalTotalTokens: (value: string) => void;
  setNameChat: (value: string) => void;
  setTotalSaldo: (value: string) => void;
  totalTokens: string | null;
  TotaltotalTokens: string | null;
  nameChat: string | null;
  totalSaldo: string | null;
}
export function Chat({
  id,
  initialMessages,
  setTotalTokens,
  setTotalTotalTokens,
  setNameChat,
  setTotalSaldo,
  totalTokens,
  TotaltotalTokens,
  nameChat,
  totalSaldo
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressStep[]>([]);
  const [containerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
  // New state to store the final report text
  const [finalReport, setFinalReport] = useState<string | null>(null);
  //const [seconds, setSeconds] = useState(0);
  const [isImproving, setIsImproving] = useState(false);
  const {
    chats,
    setChats
  } = useChatContext();

  // Ejemplo: actualiza totalTokens cuando sea necesario
  useEffect(() => {
    // Ejemplo: aquí obtienes o calculas los valores dentro de Chat
    const fetchedTotalTokens = '0'; // Reemplaza con tu lógica real
    const fetchedTotalTotalTokens = '0';
    const fetchedNameChat = "My Research Chat";
    const fetchedTotalSaldo = '10';

    // Actualiza solo si los valores no existen (son null)
    if (totalTokens === null) {
      setTotalTokens(fetchedTotalTokens);
    }
    if (TotaltotalTokens === null) {
      setTotalTotalTokens(fetchedTotalTotalTokens);
    }
    if (nameChat === null) {
      setNameChat(fetchedNameChat);
    }
    if (totalSaldo === null) {
      setTotalSaldo(fetchedTotalSaldo);
    }
  }, []);

  // State to control progress panel visibility after research completes
  const [showProgressPanel, setShowProgressPanel] = useState<boolean>(true);
  // States for interactive feedback workflow
  const [stage, setStage] = useState<"initial" | "feedback" | "researching" | "improving">("initial");
  const [initialQuery, setInitialQuery] = useState("");

  // Add state for mobile progress panel visibility
  const [showProgress, setShowProgress] = useState(false);

  // New state to track if we're on mobile (using 768px as breakpoint for md)
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    timeoutId = setTimeout(() => console.log("Hello"), 1000);
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 200); // Wait 200ms before updating
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);
  {/* Temas de sesion de usuario */}
  const {
    data: session,
    update
  } = useSession();
  const userId = session?.user?.id;
  const saveChatEntryNotify = chatData => {
    toast("Excellent! Document successfully saved!"); // Muestra la notificación
    return chatData; // Devuelve el objeto del chat
  };
  const noSaveChatEntryNotify = () => toast("Something went wrong! Please try again.");
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos

  function extraerPrimerosQuinceCaracteresDePrimeraSeccion(contenido: string) {
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

  // Update the condition to only be true when there are actual research steps
  const hasStartedResearch = progress.filter(step =>
  // Only count non-report steps or initial report steps
  step.type !== "report" || step.content.includes("Generating") || step.content.includes("Synthesizing")).length > 0;

  // Helper function to call the research endpoint
  const sendResearchQuery = async (query: string, config: {
    breadth: number;
    depth: number;
    modelId: string;
  }) => {
    try {
      setIsLoading(true);
      setShowProgressPanel(true);
      setProgress([]);
      // Inform the user that research has started
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Initiating deep research based on your inputs..."
      }]);
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query,
          breadth: config.breadth,
          depth: config.depth,
          modelId: config.modelId
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");
      const textDecoder = new TextDecoder();
      let buffer = "";
      const reportParts: string[] = [];
      while (true) {
        const {
          done,
          value
        } = await reader.read();
        if (done) break;
        buffer += textDecoder.decode(value, {
          stream: true
        });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          if (part.startsWith("data: ")) {
            const jsonStr = part.substring(6).trim();
            if (!jsonStr) continue;
            try {
              const event = JSON.parse(jsonStr);
              if (event.type === "progress") {
                if (event.step.type !== "report") {
                  // Check for duplicates before adding this progress step.
                  setProgress(prev => {
                    if (prev.length > 0 && prev[prev.length - 1].content === event.step.content) {
                      return prev;
                    }
                    return [...prev, event.step];
                  });
                }
              } else if (event.type === "result") {
                // Save the final report so we can download it later
                setFinalReport(event.report.report);

                // como ir actualizando
                setTotalTokens("+" + event.report.tokens.totalTokens.toString());

                // -------------------------------------------------------
                // --- Para guardar los chats ----------------------------
                const tokensUsed = Number(event.report.tokens.totalTokens);
                const saveReport = event.report.report;
                const nameChat = extraerPrimerosQuinceCaracteresDePrimeraSeccion(saveReport);
                try {
                  const response = await fetch('/api/save-chatentry', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      nameChat,
                      content: saveReport,
                      tokensUsed,
                      userId
                    })
                  });
                  if (!response.ok) {
                    throw new Error('Error al guardar la entrada');
                  }
                  const data = await response.json();
                  console.log(data.message); // "Entrada guardada exitosamente"

                  // Llamar a saveChatEntryNotify y obtener el objeto del chat
                  const newChat = {
                    nameChat,
                    content: saveReport,
                    tokensUsed,
                    userId
                  };
                  saveChatEntryNotify(newChat);

                  // Actualizar el contexto con el nuevo chat
                  if (newChat) {
                    setChats(prevChats => [...prevChats, newChat]);
                  }
                } catch (error) {
                  console.error('Error:', error);
                  noSaveChatEntryNotify();
                }
                //--------------------------------------------------------------------

                //--------------------------------------------------------------------
                //--------------------------------------------------------------------
                // Usar valores directamente disponibles
                const currentTotalTokens = event.report.tokens.totalTokens; // Valor directo del evento
                const currentQuery = query; // Usar 'query' recibido por sendResearchQuery como userInput

                fetch('/api/update-tokens', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    totalTokens: currentTotalTokens,
                    // Valor numérico
                    userInput: currentQuery.slice(0, 20) // Valor de texto
                  })
                }).then(response => {
                  if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                  }
                  return response.json(); // Parsear la respuesta JSON
                }).then(data => {
                  console.log('Datos recibidos:', data);
                  const newTotalTokens = data.totalTokens; // Obtener totalTokens de la respuesta
                  setTotalTotalTokens(String(newTotalTokens)); // Actualizar el estado
                  const newTotalSaldo = data.totalSaldo; // Obtener totalSaldo de la respuesta
                  setTotalSaldo(String(newTotalSaldo)); // Actualizar el estado
                }).catch(error => {
                  console.error('Error:', error);
                });
                //--------------------------------------------------------------------
                //--------------------------------------------------------------------
                // Hide progress panel when research completes
                setShowProgressPanel(false);
              } else if (event.type === "report_part") {
                reportParts.push(event.content);
              }
            } catch (e) {
              console.error("Error parsing event:", e);
            }
          }
        }
      }
      if (reportParts.length > 0) {
        // In case the report was sent in parts
        const fullReport = reportParts.join("\n");
        setFinalReport(fullReport);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: fullReport
        }]);
      }
    } catch (error) {
      console.error("Research error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, there was an error conducting the research. Please try again with a more specific query."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------------------------
  // Helper function mia para las mejoras -----------------------------------
  const sendImprovments = async (query: string, config: {
    breadth: number;
    depth: number;
    modelId: string;
  }) => {
    setIsImproving(true); // Inicia el proceso de mejora

    try {
      setIsLoading(true);
      setProgress([]);
      setShowProgressPanel(true);
      // Inform the user that research has started
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Starting document enhancements based on your inputs..."
      }]);
      const response = await fetch("/api/improvments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query,
          breadth: config.breadth,
          depth: config.depth,
          modelId: config.modelId
        })
      });
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");
      const textDecoder = new TextDecoder();
      let buffer = "";
      const reportParts: string[] = [];
      while (true) {
        const {
          done,
          value
        } = await reader.read();
        if (done) break;
        buffer += textDecoder.decode(value, {
          stream: true
        });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          if (part.startsWith("data: ")) {
            const jsonStr = part.substring(6).trim();
            if (!jsonStr) continue;
            try {
              const event = JSON.parse(jsonStr);
              if (event.type === "progress") {
                if (event.step.type !== "report") {
                  // Check for duplicates before adding this progress step.
                  setProgress(prev => {
                    if (prev.length > 0 && prev[prev.length - 1].content === event.step.content) {
                      return prev;
                    }
                    return [...prev, event.step];
                  });
                }
              } else if (event.type === "result") {
                // Save the final report so we can download it later
                setFinalReport(event.report.report);

                // como ir actualizando
                setTotalTokens("+" + event.report.tokens.totalTokens.toString());

                // -------------------------------------------------------
                // --- Para guardar los chats ----------------------------
                const tokensUsed = Number(event.report.tokens.totalTokens);
                const saveReport = event.report.report;
                const nameChat = extraerPrimerosQuinceCaracteresDePrimeraSeccion(saveReport);
                try {
                  const response = await fetch('/api/save-chatentry', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      nameChat,
                      content: saveReport,
                      tokensUsed,
                      userId
                    })
                  });
                  if (!response.ok) {
                    throw new Error('Error al guardar la entrada');
                  }
                  const data = await response.json();
                  console.log(data.message); // "Entrada guardada exitosamente"

                  // Llamar a saveChatEntryNotify y obtener el objeto del chat
                  const newChat = {
                    nameChat,
                    content: saveReport,
                    tokensUsed,
                    userId
                  };
                  saveChatEntryNotify(newChat);

                  // Actualizar el contexto con el nuevo chat
                  if (newChat) {
                    setChats(prevChats => [...prevChats, newChat]);
                  }
                } catch (error) {
                  console.error('Error:', error);
                  noSaveChatEntryNotify();
                }
                //--------------------------------------------------------------------

                //--------------------------------------------------------------------
                //--------------------------------------------------------------------
                // Usar valores directamente disponibles
                const currentTotalTokens = event.report.tokens.totalTokens; // Valor directo del evento
                const currentQuery = query; // Usar 'query' recibido por sendResearchQuery como userInput

                fetch('/api/update-tokens', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    totalTokens: currentTotalTokens,
                    // Valor numérico
                    userInput: currentQuery.slice(0, 20) // Valor de texto
                  })
                }).then(response => {
                  if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                  }
                  return response.json(); // Parsear la respuesta JSON
                }).then(data => {
                  console.log('Datos recibidos:', data);
                  const newTotalTokens = data.totalTokens; // Obtener totalTokens de la respuesta
                  setTotalTotalTokens(String(newTotalTokens)); // Actualizar el estado
                  const newTotalSaldo = data.totalSaldo; // Obtener totalSaldo de la respuesta
                  setTotalSaldo(String(newTotalSaldo)); // Actualizar el estado
                }).catch(error => {
                  console.error('Error:', error);
                });
                //--------------------------------------------------------------------
                //--------------------------------------------------------------------
                // Hide progress panel when research completes
                setShowProgressPanel(false);
                setIsImproving(false); // Termina el proceso de mejora
              } else if (event.type === "report_part") {
                reportParts.push(event.content);
              }
            } catch (e) {
              console.error("Error parsing event:", e);
            }
          }
        }
      }
      if (reportParts.length > 0) {
        // In case the report was sent in parts
        const fullReport = reportParts.join("\n");
        setFinalReport(fullReport);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: fullReport
        }]);
      }
    } catch (error) {
      console.error("Research error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, there was an error enhancing your document. Please try again with clearer instructions."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------------------------
  // ------------------------------------------------------------------------

  const handleSubmit = async (userInput: string, config: {
    breadth: number;
    depth: number;
    modelId: string;
  }) => {
    if (!userInput.trim() || isLoading) return;

    // Add user message immediately
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: "user",
      content: userInput
    }]);
    setIsLoading(true);
    if (stage === "initial") {
      // Add thinking message only for initial query
      setMessages(prev => [...prev, {
        id: "thinking",
        role: "assistant",
        content: "Processing your request..."
      }]);

      // Handle the user's initial query
      setInitialQuery(userInput);
      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: userInput,
            numQuestions: 1,
            modelId: config.modelId
          })
        });
        const data = await response.json();
        const questions: string[] = data.questions.questions || [];
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== "thinking");
          if (questions.length > 0) {
            const formattedQuestions = questions.map((q, index) => `${index + 1}. ${q}`).join("\n\n");
            return [...filtered, {
              id: Date.now().toString(),
              role: "assistant",
              content: `Por favor responda a estas sencillas preguntas para darle forma a su investigación:\n\n${formattedQuestions}`
            }];
          }
          return filtered;
        });
        setStage("feedback");

        // como ir actualizando
        setTotalTokens("+" + data.questions.tokens.totalTokens.toString());
        setNameChat("Tópico=>\n" + userInput + " ".slice(0, 10).replace(" ", "-"));

        //--------------------------------------------------------------------
        //--------------------------------------------------------------------
        fetch('/api/update-tokens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            totalTokens: data.questions.tokens.totalTokens,
            // Valor numérico
            userInput: userInput.slice(0, 20) // Valor de texto
          })
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
          }
          return response.json(); // Parsear la respuesta JSON
        }).then(data => {
          console.log('Datos recibidos:', data);
          const newTotalTokens = data.totalTokens; // Obtener totalTokens de la respuesta
          setTotalTotalTokens(String(newTotalTokens)); // Actualizar el estado
          const newTotalSaldo = data.totalSaldo; // Obtener totalSaldo de la respuesta
          setTotalSaldo(String(newTotalSaldo)); // Actualizar el estado
        }).catch(error => {
          console.error('Error:', error);
        });
        //--------------------------------------------------------------------
        //--------------------------------------------------------------------
      } catch (error) {
        console.error("Feedback generation error:", error);
        setMessages(prev => [...prev.filter(m => m.id !== "thinking"), {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, there was an error generating follow-up questions. Please refine your initial query."
        }]);
      } finally {
        setIsLoading(false);
      }
    } else if (stage === "feedback") {
      // In feedback stage, combine the initial query and follow-up answers
      const combined = `Initial Query: ${initialQuery}\nFollow-up Answers:\n${userInput}`;
      setStage("researching");
      try {
        await sendResearchQuery(combined, config);
      } finally {
        setIsLoading(false);
        // Reset the stage so further messages will be processed
        // setStage("improving");
        // Inform the user that a new research session can be started
        setMessages(prev => [{
          id: Date.now().toString(),
          role: "assistant",
          content: "Research session complete! Your PDF is ready to view."
        }]);
      }
      //-----------------------------------------------------------------------
    } else if (stage === "researching") {
      // In the improving stage, combine the initial document and follow-up requests
      const combined = `Initial Document: ${finalReport}\nFollow-up Improvments:\n${userInput}`;
      setStage("improving");
      try {
        await sendImprovments(combined, config);
      } finally {
        setIsLoading(false);
        // Mantener el estado en "improving" para que el panel de investigación siga visible
        // Inform the user that a new research session can be started
        setMessages(prev => [{
          id: Date.now().toString(),
          role: "assistant",
          content: "Enhancement complete! You can continue making additional improvements to your document."
        }]);
      }
    } else if (stage === "improving") {
      // Permitir mejoras adicionales
      const combined = `Current Document: ${finalReport}\nAdditional Improvements:\n${userInput}`;
      try {
        await sendImprovments(combined, config);
      } finally {
        setIsLoading(false);
        // Mantener el estado en "improving"
        setMessages(prev => [{
          id: Date.now().toString(),
          role: "assistant",
          content: "Enhancement applied! You can continue refining your document for optimal results."
        }]);
      }
    }
  };

  // ---------------------------------------------------
  // La parte del RETURN -------------------------------
  // ---------------------------------------------------
  return <div className="flex w-full h-full relative">
      {/* Main container with dynamic width */}
      <motion.div className={`mx-auto flex flex-col h-full pt-10 ${hasStartedResearch || stage === "improving" ? "md:mr-0" : "md:mx-auto"}`} initial={{
      width: "100%",
      maxWidth: "800px"
    }} animate={{
      width: !isMobile && (hasStartedResearch || stage === "improving") ? "55%" : "100%",
      maxWidth: !isMobile && (hasStartedResearch || stage === "improving") ? "800px" : "800px"
    }} transition={{
      duration: 0.3,
      ease: "easeInOut"
    }}>
        {/* Messages Container - Hide completely when finalReport is available */}
        <div ref={containerRef} className={`${showProgress ? "hidden md:block" : "block"} ${finalReport ? "hidden" : "flex-1 overflow-y-auto"} relative`}>
          {/* Welcome Message (if no research started and no messages) */}
          {!hasStartedResearch && messages.length === 0 && <div className="absolute inset-0 flex items-center justify-center">


          {/* PDF de muestra pagina INICIAL */}
          <object data="https://josemramirez.github.io/mmatex/pdf_examples/Portada_v1.pdf" type="application/pdf" width="60%" height="60%">
      <p>OnMMaTeX - View your research<a href="https://josemramirez.github.io/mmatex/pdf_examples/Portada_v1.pdf">Open PDF document</a></p>
          </object>

              <motion.div initial={{
            opacity: 0,
            scale: 0.95
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            type: "spring",
            stiffness: 100,
            damping: 20
          }} className="relative text-center space-y-4 p-4 md:p-12
                  before:absolute before:inset-0 
                  before:bg-gradient-to-b before:from-primary/[0.03] before:to-primary/[0.01]
                  before:rounded-[32px] before:blur-xl before:-z-10
                  after:absolute after:inset-0 
                  after:bg-gradient-to-br after:from-primary/[0.08] after:via-transparent after:to-primary/[0.03]
                  after:rounded-[32px] after:blur-md after:-z-20">
                <motion.div animate={{
              y: [-2, 2, -2],
              rotate: [-1, 1, -1]
            }} transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }} className="relative">
                  <motion.div animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }} transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }} className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/30 
                      blur-2xl rounded-full -z-10" />
                  <Feather className="w-12 h-12 mx-auto text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
                </motion.div>

                <div className="space-y-2">
                  <motion.h2 initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.2
              }} className="text-base md:text-2xl font-semibold bg-clip-text text-transparent 
                      bg-gradient-to-r from-primary via-primary/90 to-primary/80">OnMMaTeX Deep Research Engine</motion.h2>

                  <motion.p initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.3
              }} className="text-xs md:text-base text-muted-foreground/80 max-w-[340px] mx-auto leading-relaxed">Create professional-quality documents instantly with OnMMaTeX's advanced AI research capabilities.</motion.p>

                  <motion.div initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.4
              }} className="pt-2">
                    <a href="https://github.com/josemramirez/onmmatex" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2 py-1 md:px-6 md:py-2.5 text-xs md:text-sm font-medium 
                        bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/15 hover:to-primary/10
                        text-primary hover:text-primary/90 rounded-full transition-all duration-300
                        shadow-[0_0_0_1px_rgba(var(--primary),0.1)] hover:shadow-[0_0_0_1px_rgba(var(--primary),0.2)]
                        hover:scale-[1.02]">
                      <GithubIcon className="w-4 h-4 mr-1" />View LaTeX source code</a>
                  </motion.div>
                </div>
              </motion.div>
            </div>}

          {/* Messages */}
          <div className="p-4 md:p-6 space-y-6">
            {messages.map(message => <PreviewMessage key={message.id} message={message} />)}

             {/* Research Progress Panel - Only show when in progress */}
             {showProgressPanel && <ResearchProgress progress={progress} isLoading={isLoading} />}

            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>



         {/* LaTeX Editor - Show when finalReport is available */}
         {finalReport && <div className="flex-1 w-full pt-10">
             <LaTeXEditorTxt reportText={finalReport} totalTokens={totalTokens ?? ''} nameChat={nameChat ?? ''} />
           </div>}




        {/* Input - Fixed to bottom */}
        
        <div className="sticky bottom-0">
        {isLoading && !finalReport && <AtomWithCounter />}
        {isImproving && <AtomWithCounter />}
          <div className="p-4 md:p-6 mx-auto">
            <MultimodalInput onSubmit={handleSubmit} isLoading={isLoading} placeholder={stage === "initial" ? "What would you like to research today?" : stage === "feedback" ? "Please provide your answers to the follow-up questions to refine your research for greater accuracy..." : stage === "researching" ? "Research in progress... Analyzing multiple sources for accurate results." : stage === "improving" ? "What would you like to improve in your document?" : "Type your message or research query here..."} />
          </div>
        </div>
      </motion.div>




      {/* Research Progress Panel */}
      <motion.div className={`
            pt-20 fixed md:relative
            inset-0 md:inset-auto
            bg-background md:bg-transparent
            md:w-[45%]
            ${showProgress ? "flex" : "hidden md:flex"}
            ${hasStartedResearch || stage === "improving" ? "md:flex" : "md:hidden"}
          `} initial={{
      opacity: 0,
      x: 20
    }} animate={{
      opacity: 1,
      x: 0
    }} exit={{
      opacity: 0,
      x: 20
    }}>
        {/*{isLoading && !finalReport && <AtomWithCounter />}*/}
        {finalReport && <CompileTxtButton2 reportText={finalReport} totalTokens1={totalTokens ?? ""} nameChat1={nameChat ?? ""} />}
      </motion.div>




      {/* Mobile Toggle Button - Only show when research has started or improving */}
      {(hasStartedResearch || stage === "improving") && <button onClick={() => setShowProgress(!showProgress)} className={`
            md:hidden
            fixed
            bottom-24
            right-4
            z-50
            p-3
            bg-primary
            text-primary-foreground
            rounded-full
            shadow-lg
            transition-transform
            ${showProgress ? "rotate-180" : ""}
          `} aria-label="Toggle research progress">
          <PanelRightOpen className="h-5 w-5" />
        </button>}
    </div>;
}