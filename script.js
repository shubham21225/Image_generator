const themeToggle = document.querySelector(".theme-toggle");
const promptForm = document.querySelector(".prompt-form");
const PromptInput = document.querySelector(".prompt-input");
const PromptBtn = document.querySelector(".prompt-btn");
const modelSelect = document.getElementById("model-select")
const countSelect = document.getElementById("count-select")
const ratioSelect = document.getElementById("ratio-select")

const gridGallery = document.querySelector(".gallary-grid");



const API_KEY = "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";


// set theme based on the prefernce or ssteam deaflt 
(() => {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const isDarkTheme = !savedTheme === "dark" || (!savedTheme && systemPrefersDark);
  themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon" 
})();


//  Switch between light and dark themes

 const toggleTheme = () => {
   const isDarkTheme =  document.body.classList.toggle("dark-theme")
   themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon"  ;
  };




  // creating placehoplders for cards  with loading
  const createImagesCards = (selectModel, imageCount , aspectRatio , promptText) => {
    gridGallery.innerHTML = "";



    for(let i = 0 ; i < imageCount ;i++){
      gridGallery.innerHTML += ` <div class="img-card loading" id="img-card-${i}" style="aspect-ratio:${aspectRatio}" >
                        <div class="status-container">
                        <div class="spinner"></div>
                        <i class="fa-solid fa-triangle-exclamation" ></i>
                        <p class="status-text">Generating..</p>
                       </div>
                       <img src="demoimage.png" class="result-img" alt="">
                       </div> `;
    }
  };
  






 // handle form subbmission 
const handleFormSubmit = (e) => {
    e.preventDefault();
   
    // get form values
    const selectModel = modelSelect.value;
    const imageCount = parseInt(countSelect.value) || 1;
    const aspectRatio = ratioSelect.value || "1/1";
    const promptText = PromptInput.value.trim();

    console.log(selectModel, imageCount , aspectRatio , promptText);
}

promptForm.addEventListener("submit", handleFormSubmit);


themeToggle.addEventListener("click",toggleTheme);




const examplePrompts = [
  "A magic forest with glowing plants and fairy homes among giant mushrooms",
  "An old steampunk airship floating through golden clouds at sunset",
  "A future Mars colony with glass domes and gardens against red mountains",
  "A dragon sleeping on gold coins in a crystal cave",
  "An underwater kingdom with merpeople and glowing coral buildings",
  "A floating island with waterfalls pouring into clouds below",
  "A witch's cottage in fall with magic herbs in the garden",
  "A robot painting in a sunny studio with art supplies around it",
  "A magical library with floating glowing books and spiral staircases",
  "A Japanese shrine during cherry blossom season with lanterns and misty mountains"
];




















// fill prompt input with random exaample 
PromptBtn.addEventListener("click", () => {
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
//           // "x-use-cache " : "false", 
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



