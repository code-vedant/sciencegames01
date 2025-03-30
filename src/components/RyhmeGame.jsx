import { useEffect, useState } from "react";

const wordList = [
    "apple", "banana", "cherry", "grape", "orange", "peach", "plum", "kiwi", "mango", "pear",
    "lemon", "lime", "melon", "berry", "fig", "date", "guava", "papaya", "apricot", "coconut"
];

const getRandomWord = () => {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

function RyhmeGame() {

    const [qWord, setQWord] = useState("");

    useEffect(() => {
        const word = getRandomWord()
        setQWord(word);
        
    }, [qWord]);

    const [rhymingWord, setRhymingWord] = useState([]);

    const getWordFromInput = (e) => {
        const word = e.target.value;
        const lastWord = word.trim().split(" ").pop();

        if (e.key === " ") { // Check if the space key is pressed
            fetch(`https://api.datamuse.com/words?rel_rhy=${qWord}`)
                .then(response => response.json())
                .then(data => {
                    const rhymes = data.map(item => item.word);
                    console.log(rhymes);
                    
                    if (rhymes.includes(lastWord) && !rhymingWord.includes(lastWord)) {
                        setRhymingWord(prev => [...prev, lastWord]);
                    }
                })
                .catch(error => console.error("Error fetching rhyming words:", error));
        } 
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            {/* Word List */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-blue-600">{qWord}</h1>
            </div>

            {/* Textbox */}
            <textarea
                name="guess word"
                id=""
                onKeyDown={getWordFromInput} // Change from onChange to onKeyDown
                placeholder="Write the rhyming word"
                className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6"
            />

            {/* Correct Words */}
            <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Correct Words</h2>
                <ol className="list-decimal list-inside space-y-2">
                    {rhymingWord.length > 0 ? (
                        rhymingWord.map((word, index) => (
                            <li key={index} className="text-gray-600">{word}</li>
                        ))
                    ) : (
                        <li className="text-gray-400">No words</li>
                    )}
                </ol>
            </div>
        </div>
    );
}

export default RyhmeGame;
