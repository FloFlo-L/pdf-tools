import ListTools from '@/components/list-tools';

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="space-y-2 px-4 text-center">
        <h3 className="text-2xl font-semibold md:text-3xl">
          Welcome on <span className="text-primary">PDF Tools</span>
        </h3>
        <p className="text-lg font-bold">Free and easy-to-use online PDF tools that make you more productive.</p>
      </div>
      <div className="text-center">
        <p className="text-xl underline">Choose your tool now</p>
        {/* List tools */}
        <ListTools />
      </div>
    </div>
  );
}
