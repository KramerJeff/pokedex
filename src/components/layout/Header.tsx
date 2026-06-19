export const Header = () => {
  return (
    <header className="bg-red-600 text-white shadow-lg shrink-0">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">📱</div>
            <div>
              <h1 className="text-3xl font-bold">Pokédex</h1>
              <p className="text-red-100 text-sm">Gotta catch 'em all!</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-red-100">Gen I-IX</p>
            <p className="text-xs text-red-200">1000+ Pokemon</p>
          </div>
        </div>
      </div>
    </header>
  );
};
