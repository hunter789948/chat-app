import { useEffect, useState } from "react";

export default function TextType({
  words = [],
  typingSpeed = 80,
  deletingSpeed = 40,
  pause = 1500,
  className = "",
}) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));

        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setText(currentWord.substring(0, text.length - 1));

        if (text === "") {
          setIsDeleting(false);
          setWordIndex((prev) => prev + 1);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pause]);

  return (
    <span className={className}>
      {text}
      <span className="ml-1 animate-pulse">|</span>
    </span>
  );
}
