console.log('hello Javascript')

 document.querySelector(".left").style.left=0;

async function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}


let currentSong = new Audio()

let songs;
let a_path;
let c_path;

let songs2;



async function fetchSongFolder() {
    let page = await fetch("https://github.com/abhishekshelar126200/musicmingle/song_folder");
    let response = await page.text();
    // console.log(response);

    let div=document.createElement('div')
    div.innerHTML=response

    let as=div.getElementsByTagName('a')
    let songs_folder=[]
    for(song of as)
    {
        if(song.href.split("/song_folder/")[1])
        {
            songs_folder.push(song.href)
        }
    }

    return songs_folder
}



async function getSong(link){
    console.log(link)
    let page=await fetch(link)
    let response=await page.text()
    // console.log(response)
    let div=document.createElement('div')
    div.innerHTML=response

    let as=div.getElementsByTagName('a')
    console.log(as[4].href)

    let page1=await fetch(as[4].href)
    let response1=await page1.text()

    let div1=document.createElement('div')
    div1.innerHTML=response1
    let as1=div1.getElementsByTagName('a')
    console.log(as1[5].href)

    let songs0=[]
    let songs1=as1[5].href.split("/song_folder/")[1]
    
    a_path=songs1.split('/song/')[0].replaceAll('%20'," ").trim()
    console.log(a_path)

    for(song of as1)
    {
        if(song.href.endsWith('.mp3'))
        {
            songs0.push(song.href.split("/song/")[1].replaceAll("%20"," "))
            // console.log(song.href)
        }
        // else if(song.href.endsWith('.jpeg'))
        // {
        //     songs0.push(song.href.split("/song/")[1])
        //     // console.log(song.href)
        // }
    }
    return songs0

}

const playSong=(track,pause=false,text,id=false)=> {
    // var audio = new Audio("/songs/" + track);
    console.log(track)
    currentSong.src=`/song_folder/${id}/song/` + track;
    document.getElementById("songname").innerHTML=text
    if(!pause)
    {
        document.getElementById("play").src="play.svg";
        
        currentSong.play()
    }
    
    
}

// const pauseSong=()=>{
    
//     document.getElementById("play").src="pause.svg"
//     document.getElementById("play1").src="pause.svg"
//     currentSong.pause()
// }

async function main(){
    let song_folder=await fetchSongFolder()

    songs2=await getSong(song_folder[0]);
    console.log(songs2)

    console.log(song_folder[0])

    const element = document.querySelector('.list');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    let add=document.querySelector('.songlist').getElementsByTagName('ol')[0]
    let add1=document.querySelector('.songlist').getElementsByTagName('h2')[0]
    let str=song_folder[0].split("/song_folder/")[1]
    add1.innerHTML=str.slice(0,str.length-1)
    for(song of songs2)
    {
        if(song.endsWith(".mp3"))
        {
            add.innerHTML=add.innerHTML + `
        <li class="invert song">
                <div>
                    <img src="music.svg" alt="">
                    <div class="info invert">
                        <div>
                            <span> ${song.replaceAll("%20"," ")}</span>
                            <span>Feel the song</span>
                        </div>
                                    
                    </div>
                </div>
            <img id="play1" class="invert" src="pause.svg" alt="">
        </li>`

        }
        
        
    }

    playSong(songs2[0],true,songs2[0],song_folder[0].split("/song_folder/")[1])
    c_path=song_folder[0].split("/song_folder/")[1]

    let li_arr


    li_arr=Array.from(document.querySelector('.songlist').getElementsByTagName('li'))
    for(let li of li_arr)
    {
    
        // console.log(li.querySelector('span').innerHTML);
        li.addEventListener('click',()=>{
            li_arr.forEach(child => {
                child.style.backgroundColor = 'rgb(224, 224, 224)';
                child.querySelector('#play1').src="pause.svg"
            });
            li_arr[li_arr.indexOf(li)].style.backgroundColor="rgb(191, 191, 191)"
            li_arr[li_arr.indexOf(li)].querySelector('#play1').src="play.svg"
            let text=li.querySelector('span').innerHTML.trim()
           
            playSong(li.querySelector('span').innerHTML.trim(),false,text,song_folder[2].split("/song_folder/")[1])
            
        })
    }


   // console.log(songs4);
   
    console.log(song_folder)
    for(let link of song_folder)
    {
        songs=await getSong(link);
        console.log(songs);
        songs=await fetch(link+"/info.json");
        let response=await songs.json()
        console.log(response.title);

        let card=Array.from(document.querySelectorAll('.o_card'))
        card[0].innerHTML=card[0].innerHTML + `<div class="card" id="${a_path}">
        <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="black">
                <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
        </div>
        <img src="song_folder/${a_path}/song/cover.jpeg" alt="">
        <h3>${response.title}</h3>
        <p>${response.description}</p>

    </div>`
    
    

    }
    

    
    document.querySelectorAll('.card').forEach(item => {
        item.addEventListener('click', async event => {
            c_path=item.id
            add1.innerHTML=c_path
            document.getElementById("play").src="pause.svg"
            const element = document.querySelector('.list');
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            songs2=await getSong(`/song_folder/${item.id}`);
           // playSong(songs2[1],true,songs2[1].replaceAll("%20"," "),item.id)

            playSong(songs2[0],true,songs2[0],item.id)
        
            for(song of songs2)
            {
                if(song.endsWith(".mp3"))
                {
                    add.innerHTML=add.innerHTML + `
                <li class="invert song">
                        <div>
                            <img src="music.svg" alt="">
                            <div class="info invert">
                                <div>
                                    <span> ${song.replaceAll("%20"," ")}</span>
                                    <span>Feel the song</span>
                                </div>
                                            
                            </div>
                        </div>
                    <img id="play1" class="invert" src="pause.svg" alt="">
                </li>`

                }
                
                
            }


            document.querySelector(".left").style.left=0;
    
            li_arr=Array.from(document.querySelector('.songlist').getElementsByTagName('li'))
            for(let li of li_arr)
            {
            
                // console.log(li.querySelector('span').innerHTML);
                li.addEventListener('click',()=>{
                    li_arr.forEach(child => {
                        child.style.backgroundColor = 'rgb(224, 224, 224)';
                        child.querySelector('#play1').src="pause.svg"
                    });
                    li_arr[li_arr.indexOf(li)].style.backgroundColor="rgb(191, 191, 191)"
                    li_arr[li_arr.indexOf(li)].querySelector('#play1').src="play.svg"
                    let text=li.querySelector('span').innerHTML.trim()
                   
                    playSong(li.querySelector('span').innerHTML.trim(),false,text,item.id)
                    
                })
            }



            
        
        
            
            
            //console.log(item.id);
        });
    });



    document.getElementById("play").addEventListener('click',()=>{

        if(currentSong.paused)
        {
            currentSong.play();
            // console.log("Time :"+currentSong.duration)
            document.getElementById("play").src="play.svg";
        }

        else
        {
            currentSong.pause();
            // console.log("Hello1")
            document.getElementById("play").src="pause.svg";
        }
        
    });



    currentSong.addEventListener('timeupdate',async ()=>{
        let time=`${await formatTime(currentSong.currentTime)}/${await formatTime(currentSong.duration)}`
        document.getElementById("time").innerHTML=time

        document.getElementById("circle").style.width=(currentSong.currentTime/currentSong.duration)*100 + "%"
    })


    document.querySelector(".seekbar").addEventListener('click',e=>{
        let percent=((e.offsetX)/(e.target.getBoundingClientRect().width))*100
        document.getElementById("circle").style.width=percent+"%"
        currentSong.currentTime=(currentSong.duration*percent)/100
    })



    document.querySelector(".hamburger").addEventListener('click',()=>{
        document.querySelector(".left").style.left=0;
    })


    document.querySelector(".close").addEventListener('click',()=>{
        document.querySelector(".left").style.left=-100+"%";
    })


    prev.addEventListener('click',()=>{
        console.log(currentSong)
        //c_path=c_path.trim()
        let song = currentSong.src.substring(currentSong.src.lastIndexOf("/") + 1);
        console.log(song)
        console.log(c_path)
        let r_song=song.replaceAll("%20"," ").trim()
        console.log(r_song)
        console.log(songs2)
        let songs3=[]
        for(item of songs2)
        {
            if(item.endsWith(".mp3"))
            {
                songs3.push(item)
            }
        }
        let index=songs3.indexOf(r_song)
        let p_song=songs3[index-1]
        console.log(index)

        if((index-1)>-1)
        {
            li_arr.forEach(child => {
                child.style.backgroundColor = 'rgb(224, 224, 224)';
                child.querySelector('#play1').src="pause.svg"
            });

            li_arr[index-1].style.backgroundColor="rgb(191, 191, 191)"
            li_arr[index-1].querySelector('#play1').src="play.svg"
            console.log("I am Boss")
            playSong(songs3[index-1],false,p_song.replaceAll('%20'," ").trim(),c_path)
        }
        else{
            li_arr.forEach(child => {
                child.style.backgroundColor = 'rgb(224, 224, 224)';
                child.querySelector('#play1').src="pause.svg"
            });

            li_arr[songs3.length-1].style.backgroundColor="rgb(191, 191, 191)"
            li_arr[songs3.length-1].querySelector('#play1').src="play.svg"
            playSong(songs3[songs3.length-1],false,songs3[songs3.length-1].replaceAll('%20'," ").trim(),c_path)
        }

    })



    next.addEventListener('click',()=>{
        console.log(currentSong)
        let song = currentSong.src.substring(currentSong.src.lastIndexOf("/") + 1);

        let r_song=song.replaceAll("%20"," ").trim()
        console.log(r_song)

        let songs3=[]
        for(item of songs2)
        {
            if(item.endsWith(".mp3"))
            {
                songs3.push(item)
            }
        }

        let index=songs3.indexOf(r_song)
        let p_song=songs3[index+1]
        console.log(index)

        if((index+1)<songs3.length)
        {
            // console.log("I am Boss")
            li_arr.forEach(child => {
                child.style.backgroundColor = 'rgb(224, 224, 224)';
                child.querySelector('#play1').src="pause.svg"
            });

            li_arr[index+1].style.backgroundColor="rgb(191, 191, 191)"
            li_arr[index+1].querySelector('#play1').src="play.svg"
            playSong(songs3[index+1],false,p_song.replaceAll('%20'," ").trim(),c_path)
        }
        else{
            li_arr.forEach(child => {
                child.style.backgroundColor = 'rgb(224, 224, 224)';
                child.querySelector('#play1').src="pause.svg"
            });

            li_arr[0].style.backgroundColor="rgb(191, 191, 191)"
            li_arr[0].querySelector('#play1').src="play.svg"
            playSong(songs3[0],false,songs3[0].replaceAll('%20'," ").trim(),c_path)
        }

    })


    

    document.getElementById('range').addEventListener('change',(e)=>{
        console.log(e.target.value)

        currentSong.volume=parseInt(e.target.value)/100
    })


    document.getElementById('volume').addEventListener('click',()=>{

        if(currentSong.muted)
        {
            document.getElementById('volume').src="volume.svg"
            currentSong.muted=false
            document.getElementById('range').value=20;
            currentSong.volume=20/100
        }
        else
        {
            document.getElementById('volume').src="mute.svg"
            currentSong.muted=true
            document.getElementById('range').value=0;
            currentSong.volume=0
        }
    })

}



main()
