import Header from './Header.jsx';

export default function PageShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
