interface ProgressProps {
  percent?: number;
  className?: string;
}

const Progress = ({ className, percent = 0 }: ProgressProps) => {
  return (
    <div className={`flex w-full items-center ${className}`}>
      <div className="flex-1 h-[6px] bg-[#f0f0f0] mr-2 rounded overflow-hidden relative">
        <div
          className="bg-gradient-to-r from-[#FFD200] to-[#ff9900] rounded transition-all duration-[15ms]"
          style={{
            height: 6,
            width: `${percent}%`,
          }}
        ></div>
      </div>
      <span className="text-xs text-zinc-400">{Math.min(percent, 100)}%</span>
    </div>
  );
};

export default Progress;
