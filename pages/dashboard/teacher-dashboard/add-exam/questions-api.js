// trivia-api

export async function fetchTriviaQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=5&category=18&encode=url3986');
        
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        if (data.response_code !== 0) {
            throw new Error('Could not retrieve trivia questions');
        }

       return data.results.map(item => {
            // Decode the URL-encoded strings
            const decodedType = decodeURIComponent(item.type); // Will be 'multiple' or 'boolean'
            const decodedCorrect = decodeURIComponent(item.correct_answer);
            const decodedIncorrect = item.incorrect_answers.map(ans => decodeURIComponent(ans));
            const decodedQuestion = decodeURIComponent(item.question);
            
            // Combine correct and incorrect answers into one array
            const allOptions = [decodedCorrect, ...decodedIncorrect];
            
            // Shuffle the options array
            allOptions.sort(() => Math.random() - 0.5);
            
            // Find the new index of the correct answer (for MCQ)
            const correctIndex = (allOptions.indexOf(decodedCorrect) + 1).toString();

            return {
                rawType: decodedType,         // 'boolean' or 'multiple'
                questionText: decodedQuestion,
                options: allOptions,
                correctIndex: correctIndex,   // Useful for MCQ
                correctAnswer: decodedCorrect // Useful for True/False
            };
        });
    } catch (error) {
        console.error("Error fetching trivia:", error);
        return null;
    }
}