const incEL = document.querySelector("#btn-inc");
const displayEL = document.querySelector("#display");

let count = 0
incEL.addEventListener('click', function()  {

displayEL.textContent = count++;

})

const decEL =document.querySelector("#btn-dec");
decEL.addEventListener('click', function()   {
    {
        if (count > 0)
            if (count <=0)
         count --;
    }
         displayEL.textContent=count;
})


const resEL =document.querySelector("#btn-res");
resEL.addEventListener('click', function()   {
         count = 0;
         displayEL.textContent=count;
})



