export function generateRandomString({ length, lettersLower, lettersUpper, numbers }) {
    console.log(numbers,"numbers")
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    
    let charPool = "";
  
    // Build the pool of characters based on the input object
    if (lettersLower) charPool += lowerChars;
    if (lettersUpper) charPool += upperChars;
    if (numbers) charPool += numberChars;
  
    if (charPool === "") {
      throw new Error("At least one character type must be selected.");
    }
  
    // Generate the random string
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      result += charPool[randomIndex];
    }
  
    return result;
  }
  
 export function transformArrayToObject(array) {
    return array.reduce((acc, item) => {
      const { tagName, ...rest } = item;
      acc[tagName] =rest; 
      return acc;
    }, {});
  }
  
  