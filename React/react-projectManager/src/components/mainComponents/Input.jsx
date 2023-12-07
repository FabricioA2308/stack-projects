import { forwardRef } from "react";

const Input = forwardRef(function Input({ title, ...props }, ref) {
  const inputElStyle =
    "w-full p-1 border-b-2 rounded=sm border-stone-300 bg-stone-200 text-stone-600 focus:outline-none focus:border-stone-600";

  return (
    <p className="flex flex-col gap-1 my-4">
      <label className="text-sm font-bold uppercase text-stone-500">
        {title}
      </label>
      {title == "description" ? (
        <textarea {...props} className={inputElStyle} ref={ref} />
      ) : (
        <input {...props} className={inputElStyle} ref={ref} />
      )}
    </p>
  );
});

export default Input;
