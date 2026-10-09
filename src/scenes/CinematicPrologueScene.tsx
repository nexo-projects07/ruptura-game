import React, { useState } from 'react';
import { ChevronRight, Radio, Compass, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { KaelAvatar } from '../components/KaelAvatar';
import { audio } from '../systems/AudioEngine';

interface PanelData {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  lines: string[];
  icon: React.ReactNode;
  accentColor: 'cyan' | 'fuchsia' | 'rose' | 'amber';
}

const prologuePanels: PanelData[] = [
  {
    id: 1,
    tag: 'CRONOLOGIA // 2147',
    title: 'ANO 2147',
    subtitle: 'FRONTEIRAS DO ESPAÇO',
    lines: [
      'Durante décadas, a humanidade acreditou ter conquistado as fronteiras do universo conhecidas.',
      'Tecnologia de dobra, redes gravitacionais e inteligências quânticas dominavam a infraestrutura de Nova Arcádia.'
    ],
    icon: <Compass className="w-8 h-8 text-cyan-400 animate-pulse" />,
    accentColor: 'cyan',
  },
  {
    id: 2,
    tag: 'ANOMALIA GLOBAL',
    title: 'A GRANDE CONVERGÊNCIA',
    subtitle: 'COLAPSO MULTIDIMENSIONAL',
    lines: [
      'Até que diferentes realidades e vetores de matéria começaram a ocupar o mesmo espaço físico no mesmo instante.',
      'As leis da física convencional colapsaram em menos de três minutos.'
    ],
    icon: <Sparkles className="w-8 h-8 text-fuchsia-400 animate-spin" />,
    accentColor: 'fuchsia',
  },
  {
    id: 3,
    tag: 'EVOLUÇÃO DA FENDA',
    title: 'A RUPTURA',
    subtitle: 'DESINTEGRAÇÃO URBANA',
    lines: [
      'Em poucos minutos, cidades inteiras foram irreversivelmente transformadas.',
      'Edifícios espelhados desapareceram. Regiões inteiras fundiram-se com dimensões desconhecidas e hostis.'
    ],
    icon: <ShieldAlert className="w-8 h-8 text-rose-500 animate-bounce" />,
    accentColor: 'rose',
  },
  {
    id: 4,
    tag: 'MARCO ZERO',
    title: 'NOVA ARCÁDIA',
    subtitle: 'METRÓPOLE ISOLADA',
    lines: [
      'Uma das maiores metrópoles tecnológicas do planeta tornou-se o epicentro direto da anomalia.',
      'Sinais de rádio e comunicações quânticas foram cortados por um campo de interferência dimensional.'
    ],
    icon: <Radio className="w-8 h-8 text-cyan-300" />,
    accentColor: 'cyan',
  },
  {
    id: 5,
    tag: 'PROTOCOLO TÁTICO',
    title: '72 HORAS DEPOIS',
    subtitle: 'DIRETRIZ DE SOBREVIVÊNCIA',
    lines: [
      'Os sobreviventes isolados no perímetro urbano aprenderam rapidamente a única regra que importa:',
      'Nunca atravesse uma fenda de Ruptura sem equipamento de estabilização.'
    ],
    icon: <Terminal className="w-8 h-8 text-amber-400" />,
    accentColor: 'amber',
  },
  {
    id: 6,
    tag: 'UNIDADE DE RECONHECIMENTO',
    title: 'KAEL — EXPLORADOR',
    subtitle: 'SISTEMA DE CONTENÇÃO',
    lines: [
      'Kael faz parte da divisão tática enviada para investigar o Setor 01 do Ponto de Impacto.',
      'Seu trabalho é direto: Entrar na zona afetada. Descobrir a causa do colapso. E voltar vivo.'
    ],
    icon: <Compass className="w-8 h-8 text-cyan-400" />,
    accentColor: 'cyan',
  },
];

export const CinematicPrologueScene: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);

  const panel = prologuePanels[currentPanelIndex];
  const isLastPanel = currentPanelIndex === prologuePanels.length - 1;
  const progressPercent = Math.round(((currentPanelIndex + 1) / prologuePanels.length) * 100);

  const handleNext = () => {
    if (isLastPanel) {
      audio.playClick();
      onComplete();
    } else {
      audio.playCinematicTransition();
      setCurrentPanelIndex(prev => prev + 1);
    }
  };

  return (
    <div className="relative w-full h-full min-h-dvh flex flex-col justify-between p-4 md:p-8 overflow-hidden select-none bg-slate-950">
      <AtmosphericCanvas />

      <header className="relative z-20 w-full max-w-4xl mx-auto flex items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] md:text-xs text-cyan-300 font-bold tracking-widest uppercase">
            RUPTURA // PRÓLOGO NARRATIVO
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-bold">
            0{currentPanelIndex + 1} / 0{prologuePanels.length}
          </span>
          <div className="w-20 md:w-32 bg-slate-900 border border-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      <main className="relative z-20 w-full max-w-3xl mx-auto my-auto py-6">
        <div className="bg-slate-900/90 border border-cyan-500/40 p-6 md:p-10 rounded-2xl backdrop-blur-xl shadow-2xl shadow-cyan-950/70 space-y-6 transition-all duration-500">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-950 border border-cyan-500/30">
                {panel.icon}
              </div>
              <div>
                <span className="text-[10px] md:text-xs font-mono text-cyan-400 font-bold tracking-widest block uppercase">
                  {panel.tag}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {panel.subtitle}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className={`${isLastPanel ? 'md:col-span-2' : 'md:col-span-3'} space-y-4`}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                {panel.title}
              </h2>

              <div className="space-y-3 text-slate-300 text-sm md:text-base leading-relaxed font-light">
                {panel.lines.map((line, idx) => (
                  <p key={idx} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                    "{line}"
                  </p>
                ))}
              </div>
            </div>

            {isLastPanel && (
              <div className="flex flex-col items-center justify-center p-2 bg-slate-950/80 border border-cyan-500/30 rounded-xl">
                <KaelAvatar state="idle" />
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40 mt-1">
                  HP: 100 | ATK: 20 | DEF: 10
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between font-mono">
            <div className="text-[10px] text-slate-500 hidden sm:block">
              PRESSIONAR BOTÃO PARA AVANÇAR
            </div>

            <button
              onClick={handleNext}
              className="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold tracking-wider uppercase rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition duration-200 flex items-center justify-center gap-2 text-xs md:text-sm ml-auto"
            >
              <span>{isLastPanel ? 'ENTRAR EM NOVA ARCÁDIA' : 'CONTINUAR'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </main>

      <footer className="relative z-20 w-full max-w-4xl mx-auto flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>SISTEMA REGIONAL: ATIVO</span>
        <span>TRANSMISSÃO DE DADOS DIMENSIONAIS</span>
      </footer>
    </div>
  );
};