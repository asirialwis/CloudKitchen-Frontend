const Loader = () => {
  return (
    <div className="flex w-full items-center justify-center h-screen gap-2">
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-yellow animate-bounce" />
        <div className="w-4 h-4 rounded-full bg-yellow animate-bounce [animation-delay:-.3s]" />
        <div className="w-4 h-4 rounded-full bg-yellow animate-bounce [animation-delay:-.5s]" />
      </div>
    </div>
  );
};

export default Loader;
