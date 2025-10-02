import { useState } from "react";
// import { aiAPI } from '../utils/api';
import Layout from "../../components/Layout";
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
// import toast from 'react-hot-toast';

const QA = () => {
  const [question, setQuestion] = useState("");
  const [conversations, setConversations] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const currentQuestion = question.trim();
    setQuestion("");
    setLoading(true);

    // Add question to conversation
    const newConversation = {
      id: Date.now(),
      question: currentQuestion,
      answer: null,
      loading: true,
      timestamp: new Date(),
    };

    setConversations((prev) => [newConversation, ...prev]);

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/user/ask?userId=${localStorage.getItem("userId")}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: currentQuestion }),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json(); // ✅ parse JSON

      // Update conversation with answer
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === newConversation.id
            ? {
                ...conv,
                answer: data.result.answer, // ✅ use parsed data
                loading: false,
              }
            : conv
        )
      );
    } catch (error) {
      toast.error("Failed to get answer");
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === newConversation.id
            ? {
                ...conv,
                answer:
                  "Sorry, I encountered an error while processing your question.",
                loading: false,
              }
            : conv
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[var(--color-bg-2)] rounded-full">
              <SparklesIcon className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-color)]">
            AI Q&A Assistant
          </h1>
          <p className="text-[var(--text-color-2)] mt-2">
            Ask questions about your team's knowledge base and get AI-powered
            answers
          </p>
        </div>

        {/* Question Form */}
        <div className="bg-[var(--color-bg-2)] rounded-lg shadow-sm border text-[var(--text-color)] border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-[var(--text-color-2)] mb-2"
              >
                Ask a question
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="What would you like to know about your team's documents?"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--text-color)] bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                {loading ? "Asking..." : "Ask AI"}
              </button>
            </div>
          </form>
        </div>

        {/* Conversations */}
        {conversations?.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-[var(--text-color)]">
              Conversation History
            </h2>

            {conversations?.map((conv) => (
              <div
                key={conv.id}
                className="bg-[var(--color-bg-2)] rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Question */}
                <div className="bg-[var(--color-bg-2)] px-6 py-4 border-b border-gray-200">
                  <div className="flex items-start space-x-3">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-[var(--text-color-2)] mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--text-color)]">
                        You asked:
                      </p>
                      <p className="text-[var(--text-color)] mt-1">
                        {conv.question}
                      </p>
                      <p className="text-xs text-[var(--text-color-2)] mt-2">
                        {conv.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Answer */}
                <div className="px-6 py-4">
                  {conv?.loading ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600" />
                      <p className="text-[var(--text-color-2)]">
                        AI is thinking...
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <SparklesIcon className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text-color)] mb-2">
                          AI Answer:
                        </p>
                        <div className="prose prose-sm max-w-none text-[var(--text-color-2)]">
                          {conv.answer.split("\n").map((line, index) => (
                            <p key={index} className="mb-2">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {conversations?.length === 0 && (
          <div className="text-center py-12 bg-[var(--color-bg-2)] rounded-lg shadow-sm border border-gray-200">
            <SparklesIcon className="mx-auto h-12 w-12 text-[var(--text-color-2)]" />
            <h3 className="mt-2 text-sm font-medium text-[var(--text-color)]">
              No questions yet
            </h3>
            <p className="mt-1 text-sm text-[var(--text-color-2)]">
              Ask your first question to get AI-powered answers from your
              knowledge base
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QA;
