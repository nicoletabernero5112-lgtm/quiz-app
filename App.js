import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ButtonGroup } from 'react-native-elements';

const Stack = createStackNavigator();
const Items = [
  { 
    "prompt": "What is UCF's current mascot?",
  "type": "multiple-choice",
  "choices": [
    "Knightro",
    "Citronaut",
    "Eagle",
    "Dragon",
  ],
  "correct": 0
},
  {
      "prompt": "What is UCF's colors?",
  "type": "multiple-answer",
  "choices": [
    "Blue",
    "White",
    "Black",
    "Gold",
  ],
  "correct": [2, 3]
},
  {
  "prompt": "Is UCF located in Orlando, Florida?",
  "type": "true-false",
  "choices": [
    "True",
    "False",
  ],
  "correct": 0
},
];

export function Question({ route, navigation }) {
  const { data, index, answers } = route.params;
  const question = data[index];
  const [selectedIndexes, setSelectedIndexes] = useState(question.type === "multiple-answer" ? [] : null
  );
  const isSelect = (i) => {
    if (question.type === "multiple-answer") {
      setSelectedIndexes(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
      );
    } else { setSelectedIndexes(i);
    }
};

const isNext = () => {
  const newAnswers = [...answers];
  newAnswers[index] = selectedIndexes;
  if (index + 1 < data.length) {
    navigation.replace("Question", { data, index: index + 1, answers: newAnswers});
  } else {
    navigation.replace("Summary", { data, answers: newAnswers
    });
  }
};

return (
  <View style={styles.container}>
    <Text style={styles.prompt}>{question.prompt}</Text>
  
    <ButtonGroup
    testID="choices"
    buttons={question.choices}
    selectedIndexes={
      question.type === "multiple-answer" ? selectedIndexes : selectedIndexes !== null ? [selectedIndexes] : []
    }
    onPress={isSelect}
    vertical
    selectMultiple={question.type === "multiple-answer"}
    />
    <Button title="Next Question" onPress={isNext}
    />
    </View>
);
}

export function Summary({ route }) {
  const { data, answers } = route.params;
  let score = 0;
  const isCorrect = (q, userAnswer) => {
    if (Array.isArray(q.correct)) {
      return (
        Array.isArray(userAnswer) &&
        q.correct.length === userAnswer.length &&
        q.correct.every(i => userAnswer.includes(i))
      );
    }
  return userAnswer === q.correct;
  };

  data.forEach((q, i) => {
    if (isCorrect(q, answers[i])) score++;
  });

  return (
    <ScrollView style={styles.container}>
      <Text testID="total" style={styles.score}>
        Your Score: {score} / {data.length}
      </Text>

      {data.map((q, i) => {
        const userAnswer = answers[i];
        const correct = isCorrect(q, userAnswer);
        return (
          <View key={i} style={styles.questionBlock}>
            <Text style={styles.prompt}>{q.prompt}</Text>
          {q.choices.map((choice, idx) => {
      const isSelected =
        Array.isArray(userAnswer)
          ? userAnswer.includes(idx)
          : userAnswer === idx;

      const isCorrectChoice = Array.isArray(q.correct)
        ? q.correct.includes(idx)
        : q.correct === idx;

      let textStyles = {};

      if (isCorrectChoice) {
        textStyles = styles.correct;
      } else if (isSelected) {
        textStyles = styles.incorrect;
      }
            return (
              <Text key={idx} style={textStyles}>
              {choice}</Text>
            );
          })}
          <Text>
            {correct ? "You're right!" : "Aw man, that's wrong."}
          </Text>
          </View>
        );
      })}
      </ScrollView>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerLeft: () => null }}>
        <Stack.Screen name="Question">
          {(props) => (
            <Question {...props}
            route={{ ...props.route,
              params: { 
                data: Items, 
                index:0, 
                answers: []
              }
            }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Summary" component={Summary} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prompt: {
    fontSize: 20
  },
  questionBlock: {
    marginBottom: 20,
    alignItems: 'center'
  },
  bold: {
    fontWeight: 'bold'
  },
  correct: {
    fontWeight: 'bold'
  },
  incorrect: {
    textDecorationLine: 'line-through'
  },
  score: {
    fontSize: 20
  },
});
