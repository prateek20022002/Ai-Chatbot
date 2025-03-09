const API_BASE_URL = "http://localhost:5000";

const sendMessage = async (message, setResponse, setIsLoading) => {
  if (!message) return;
  setResponse("");

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    setIsLoading(false);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      fullResponse += chunk;
      setResponse((prev) => prev + chunk); // Update the response in real-time
    }

    return fullResponse;
  } catch (error) {
    console.error("Error fetching response:", error);
    setResponse("Error getting AI response.");
    throw error;
  }
};

export default sendMessage;
