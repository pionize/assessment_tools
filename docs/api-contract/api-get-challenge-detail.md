# Get Challenge Detail API

- Base URL from env: `VITE_API_BASE_URL`
- Path: `/challenges/[challengeID]`

## Request

- Method: `GET`
- Header: `Authorization: Bearer <jwt, from authenticate API>`

---

## Response Examples

### Code
```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Success"
  },
  "response_output": {
    "detail": {
      "id": "challenge-1",
      "title": "React Component Implementation",
      "type": "code",
      "description": "Create a reusable React component that displays a list of users with search functionality.",
      "instructions": "# React Component Challenge\r\n\r\nCreate a UserList component with the following requirements:\r\n- Display a list of users from props\r\n- Include search functionality\r\n- Show user avatar, name, and email\r\n- Handle loading and empty states\r\n\r\n## Requirements:\r\n- Use functional components with hooks\r\n- Implement search filtering\r\n- Add proper TypeScript types\r\n- Include basic styling",
      "time_limit": 60,
      "files": {
        "UserList.jsx": {
          "content": "// Implement your UserList component here\r\n\r\nconst UserList = ({ users }) => {\r\n  return (\r\n    <div>\r\n      {/* Your implementation here */}\r\n    </div>\r\n  );\r\n};\r\n\r\nexport default UserList;",
          "language": "javascript"
        },
        "App.jsx": {
          "content": "import UserList from \"./UserList\";\r\n\r\nconst users = [\r\n  { id: 1, name: \"John Doe\", email: \"john@example.com\", avatar: \"https://via.placeholder.com/40\" },\r\n  { id: 2, name: \"Jane Smith\", email: \"jane@example.com\", avatar: \"https://via.placeholder.com/40\" }\r\n];\r\n\r\nfunction App() {\r\n  return (\r\n    <div className=\"App\">\r\n      <UserList users={users} />\r\n    </div>\r\n  );\r\n}\r\n\r\nexport default App;",
          "language": "javascript"
        }
      }
    }
  }
}
```

### Open Ended
```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Success"
  },
  "response_output": {
    "detail": {
      "id": "challenge-2",
      "title": "Algorithm Problem",
      "type": "open-ended",
      "description": "Solve this algorithmic problem and explain your approach.",
      "instructions": "# Two Sum Problem\r\n\r\nGiven an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\r\n\r\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\r\n\r\n## Example:\r\nInput: nums = [2,7,11,15], target = 9\r\nOutput: [0,1]\r\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\r\n\r\n## Requirements:\r\n1. Provide the solution code\r\n2. Explain your approach and time complexity\r\n3. Discuss alternative solutions if any",
      "time_limit": 30
    }
  }
}
```

### Code
```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Success"
  },
  "response_output": {
    "detail": {
      "id": "challenge-3",
      "title": "JavaScript Fundamentals Quiz",
      "type": "multiple-choice",
      "description": "Test your knowledge of JavaScript fundamentals and modern ES6+ features.",
      "instructions": "Answer the following multiple-choice questions about JavaScript. Each question has only one correct answer.",
      "time_limit": 25,
      "questions": [
        {
          "id": 1,
          "question": "What is the output of the following code?\n\n```javascript\nconsole.log(typeof null);\n```",
          "options": [
            { "id": "A", "text": "\"null\"" },
            { "id": "B", "text": "\"object\"" },
            { "id": "C", "text": "\"undefined\"" },
            { "id": "D", "text": "\"boolean\"" }
          ],
          "explanation": "In JavaScript, `typeof null` returns \"object\". This is a well-known quirk in the language."
        },
        {
          "id": 2,
          "question": "Which of the following is NOT a valid way to declare a variable in modern JavaScript?",
          "options": [
            { "id": "A", "text": "let myVar = 10;" },
            { "id": "B", "text": "const myVar = 10;" },
            { "id": "C", "text": "var myVar = 10;" },
            { "id": "D", "text": "variable myVar = 10;" }
          ],
          "explanation": "\"variable\" is not a valid JavaScript keyword for declaring variables."
        },
        {
          "id": 3,
          "question": "What does the spread operator (...) do when used with arrays?",
          "options": [
            { "id": "A", "text": "Creates a shallow copy of the array" },
            { "id": "B", "text": "Expands array elements individually" },
            { "id": "C", "text": "Can be used for array concatenation" },
            { "id": "D", "text": "All of the above" }
          ],
          "explanation": "The spread operator can create shallow copies, expand elements individually, and is commonly used in concatenation operations."
        }
      ]
    }
  }
}

```