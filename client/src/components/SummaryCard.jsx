function SummaryCard({ title, amount, icon, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-400">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            {amount}
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-2xl">
          {icon}
        </div>

      </div>

      <p className="mt-4 text-xs text-gray-400">
        {description}
      </p>

    </div>
  );
}

export default SummaryCard;