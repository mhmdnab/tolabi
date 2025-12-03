type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <div className="mb-8 flex w-full justify-center">
      <h1 className="inline-flex items-center gap-2 rounded-full bg-white/70 px-5 py-3 text-2xl font-bold text-frameBlack shadow-sm backdrop-blur">
        {title}
      </h1>
    </div>
  );
}
