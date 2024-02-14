all = ['beizer', 'blobby','bouncing_ball','4d','cube_projection','flappy_bird','floating_ball',
      'knots','minecraft','pendullum','perlin_blurr','purple_rain','snakes','starfield','terrain','tree_fractal','map','sponge','life','lorenz_attractor','elementary','lsystem','lsystemtriangle','tic-tac-toe','mandelbrot','conway']

list = document.querySelector('.list')

// console.log(list.innerHTML)

list.innerHTML = ''

/*
<div class="xl:w-1/4 md:w-1/2 p-4">
        <div class="bg-gray-100 p-6 rounded-lg">
          <img class="h-40 rounded w-full object-cover object-center mb-6" src="https://dummyimage.com/720x400" alt="content">
          <h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-4">Chichen Itza</h2>
          <p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
        </div>
      </div>

*/

for(let i =0; i<all.length;i++){
    // console.log(all[i])
    list.innerHTML += '<div class="xl:w-1/4 md:w-1/2 p-4"><div class="bg-gray-100 p-6 rounded-lg"><img class="h-40 rounded w-full object-cover object-center mb-6" src=./'+all[i]+'/image.png alt='+all[i]+'><h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">ART</h3><h2 class="text-lg text-gray-900 font-medium title-font mb-4">'+all[i]+'</h2><p class="leading-relaxed text-base">Check this out !! by clicking on button!</p><a href="./'+all[i]+'/index.html" ><button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Click</button></a></div></div>'
}
