import { useEffect, useState } from "react";

function TypingTest() {

  const [stringToType, setStringToType] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/string")
      .then(response => response.text())
      .then(data => setStringToType(data));
  }, []);

  return <div>{stringToType}</div>;
}

export default TypingTest;
