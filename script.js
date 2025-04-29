const themeToggle = document.querySelector(".theme-toggle");
const promptForm = document.querySelector(".prompt-form");
const PromptInput = document.querySelector(".prompt-input");
const promptBtn = document.querySelector(".prompt-btn");
const generateBtn = document.querySelector(".gererate-btn")
const modelSelect = document.getElementById("model-select")
const countSelect = document.getElementById("count-select")
const ratioSelect = document.getElementById("ratio-select")

const gridGallery = document.querySelector(".gallary-grid");

console.log(gridGallery)

const API_KEY = "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";


// set theme based on the prefernce or ssteam deaflt 
(() => {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  const isDarkTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);

  themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon" 
})();


//  Switch between light and dark themes

 const toggleTheme = () => {
   const isDarkTheme =  document.body.classList.toggle("dark-theme")
   themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon"  ;
  };


// calculate  width / height based on choosen ratio

const getImageDimensions = (aspectRatio, baseSize = 512) => {
  const [width, height ] = aspectRatio.split("/").map(Number);
  const scaleFactor = baseSize / Math.sqrt(width * height);

  let calculatedWidth = Math.round(width * scaleFactor);
  let calculatedheight = Math.round(height * scaleFactor);

  // Ensure dimensions are multiples of 16 (AI model requirements ) 

  calculatedWidth = Math.floor(calculatedWidth / 16 ) * 16 ;
  calculatedheight = Math.floor(calculatedheight / 16) *16 ;

  return { width: calculatedWidth, height : calculatedheight }; 

};




//replace looading spinner with the actual imges
const updateImageCard = (imgIndex , imgUrl) => {
  const imgCard = document.getElementById(`img-card-${imgIndex}`)
  if(!imgCard) return;

  imgCard.classList.remove("loading")
  imgCard.innerHTML  = `<img src="${imgUrl} " class="result-img">
                           <div class="img-overlay">
                            <a href="${imgUrl}" class="img-download-btn" download="${Date.now()}.png" >
                                <i  class="fa-solid fa-download" ></i>
                            </a>
                        </div>`

}





  
 const generateImages = async (selectModel, imageCount ,aspectRatio , promptText) => {
  const MODEL_URL = `https://router.huggingface.co/hf-inference/models/${selectModel}` ;
   
  const {width, height } =  getImageDimensions(aspectRatio);

  generateBtn.setAttribute("disabled","true");


// create an array of images generations promises 

  const  imagePromises = Array.from({length : imageCount} , async(_,i)  => {

      try{
    const response = await fetch(MODEL_URL , {
      
        headers: {
          Authorization: `Bearer ${API_KEY} `,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: promptText,
          parameters : {width, height},
          // "x-use-cache" : "false", 
          option: { wait_for_model: true , use_cache  : false },
        }),
      });

      if(!response.ok) throw new Error((await response.json())?.error);
      const result = await response.blob();

       
      updateImageCard(i , URL.createObjectURL(result));
      console.log(result)


  } catch(error){
    console.log(error);
    const imgCard = document.getElementById(`img-card-${i}`);
    imgCard.classList.replace("loading","error");
    imgCard.querySelector(".status-text").textContent = " generation failed check console for more details  "
  }
})

 await Promise.allSettled(imagePromises);
 generateBtn.removeAttribute("disabled")
  
 };





  // creating placehoplders for cards  with loading
  const createImagesCards = (selectModel, imageCount , aspectRatio , promptText) => {

    console.log(selectModel,imageCount,aspectRatio,promptText)

  gridGallery.innerHTML = "";


  

    for(let i = 0; i < imageCount; i++){
      gridGallery.innerHTML += `<div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}">
                        <div class="status-container">
                        <div class="spinner"></div>
                        <i class="fa-solid fa-triangle-exclamation" ></i>
                        <p class="status-text">Generating..</p>
                       </div>
        
                       </div>`; }

    generateImages(selectModel, imageCount ,aspectRatio , promptText);
  };



 // handle form submission 
const handleFormSubmit = (e) => {
    e.preventDefault();
   
    // get form values
    const selectModel = modelSelect.value;
    const imageCount = parseInt(countSelect.value) || 1;
    const aspectRatio = ratioSelect.value || "1/1";
    const promptText = PromptInput.value.trim();

    console.log(selectModel, imageCount , aspectRatio , promptText);


    createImagesCards(selectModel, imageCount, aspectRatio, promptText);



    
}










promptForm.addEventListener("submit", handleFormSubmit);


themeToggle.addEventListener("click",toggleTheme);




const examplePrompts = [
  "A magic forest with glowing plants and fairy homes among giant mushrooms",
  "An old steampunk airship floating through golden clouds at sunset",
  "A future Mars colony with glass domes and gardens against red mountains",
  "A dragon sleeping on gold coins in a crystal cave",
  "An underwater kingdom with mere people and glowing coral buildings",
  "A floating island with waterfalls pouring into clouds below",
  "A witch's cottage in fall with magic herbs in the garden",
  "A robot painting in a sunny studio with art supplies around it",
  "A magical library with floating glowing books and spiral staircases",
  "A Japanese shrine during cherry blossom season with lanterns and misty mountains"
];









  













// fill prompt input with random exaample 
promptBtn.addEventListener("click", () => {
  const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length )];
  PromptInput.value = prompt ;
  PromptInput.focus();
} )









//  const generateImages = async (selectModel, imageCount ,aspectRatio , promptText) => {
//   const MODEL_URL = `"https://router.huggingface.co/hf-inference/models/${selectModel}"` ;
   
//   const {width, height } =  getImageDimensions(aspectRatio)


// // create an array of images generations promises 

//   const  imagePromises = Array.from({length : imageCount} , async(_,i)  => {

//       try{
//     const response = await fetch(MODEL_URL , {
      
//         headers: {
//           Authorization: `Bearer ${API_KEY} `,
//           "Content-Type": "application/json",
//         },
//         method: "POST",
//         body: JSON.stringify({
//           inputs: promptText,
//           parameters : {width, height},
//           // "x-use-cache" : "false", 
//           Option: { wait_for_model: true , user_cache : false },
//         }),
//       });

//       if(!response.ok) throw new Error((await response.json())?.error);
//       const result = await response.blob();
//       console.log(result)


//   } catch(error){
//     console.log(error);
//   }
// })

// await Promise.allSettled(imagePromises);
  
 








//   generateImages(selectModel, imageCount ,aspectRatio , promptText);















// // calculate  width / height based on choosen ratio

// const getImageDimensions = (aspectRatio, baseSize = 512) => {
//   const [width, height ] = aspectRatio.split("/").map(Number);
//   const scaleFactor = baseSize / Math.sqrt(width * height);

//   let calculatedWidth = Math.round(width * scaleFactor);
//   let calculatedheight = Math.round(height * scaleFactor);

//   // Ensure dimensions are multiples of 16 (AI model requirements ) 

//   calculatedWidth = Math.floor(calculatedWidth / 16 ) * 16 ;
//   calculatedheight = Math.floor(calculatedheight / 16) *16 ;

//   return { width: calculatedWidth, height : calculatedheight }; 

// }



