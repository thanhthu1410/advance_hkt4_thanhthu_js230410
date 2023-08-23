class Player {
    id : number
    name : string
    point : number
    constructor(name: string, point : number = 0,id:number = Date.now()*Math.random()){
        this.id = id
        this.name = name
        this.point = point
    }
}

class PlayerManage{
    players : Player[] = [];
    constructor(){
        let pointLocal = JSON.parse((localStorage.getItem("players")) ?? "[]");
        let pointTemp = []
        for(let i in pointLocal){
            pointTemp.push(new Player(pointLocal[i].name,pointLocal[i].point,pointLocal[i].id))
        }
        this.players = pointTemp;
        this.render();
        this.totalPlayer();
        this.totalPoint()
    }
    createPlayer(newPlayer: Player ) {
        this.players.push(newPlayer);
        localStorage.setItem("players", JSON.stringify(this.players));
        this.render();
        this.totalPlayer();

    };
    increasePoint(idPlayer:number){
         this.players = this.players.map(player => {
           if( player.id == idPlayer){
                player.point = player.point + 1
           }
           return player
        })
        localStorage.setItem("players",JSON.stringify(this.players))
        this.render();
        this.totalPoint()
    };
    decreasePoint(idPlayer:number){
        this.players = this.players.map(player => {
          if( player.id == idPlayer){
            if( player.point > 0){
                player.point = player.point - 1
            }
              
          }
          return player
       })
       localStorage.setItem("players",JSON.stringify(this.players))
       this.render();
       this.totalPoint()
   };
   deletePlayer(idPlayer:number){
        this.players = this.players.filter((player) => player.id !== idPlayer)
        localStorage.setItem("players",JSON.stringify(this.players))
        this.render();
        this.totalPlayer();
        this.totalPoint()
   }

   findMaxPointPlayers(): number[] {
    let maxPointPlayers: number[] = [];
    let maxPoint = 0;
    
    for (const player of this.players) {
        if (player.point > maxPoint) {
            maxPoint = player.point;
            maxPointPlayers = [player.id];
        } else if (player.point === maxPoint) {
            maxPointPlayers.push(player.id);
        }
    }
    
    return maxPointPlayers;
}
    render():void{
     
        const maxPointPlayerIds = this.findMaxPointPlayers();
        
        const personWithMaxPoint =  this.players.reduce((maxPerson, currentPerson) => currentPerson.point > maxPerson.point ? currentPerson : maxPerson, this.players[0]);
        console.log("personWithMaxPoint",personWithMaxPoint);
        
        let renderEl = document.getElementById("container-content") as HTMLElement
        let valueString = ``;
        this.players.length > 0 ?  this.players.map((player) => {
            const isMaxPointPlayer = maxPointPlayerIds.includes(player.id);
         
            valueString += `
            <div class="item">
                <span onclick="handlDelete(${player.id})" class="mark" >x</span>
                <span><i class="fa-regular fa-chess-queen ${isMaxPointPlayer ? "maxpoint" : ""}" id="maxpoint"></i></span>
                <span class="name">${player.name} </span>
                <div class="edit">
                    <span class="increase" onclick="increasePoint(${player.id})">+</span>
                    <span class="point">${player.point}</span>
                    <span class="decrease" onclick="decreasePoint(${player.id})">-</span>
                </div>
            </div>
            
            `
        }): valueString += `<p class="noplayer">No player</p>`
     
        renderEl.innerHTML = valueString

    };
    totalPlayer (){
        const totalPlayer = document.getElementById("totalPlayer") as HTMLElement
        totalPlayer.innerText = this.players.length.toString()
    };
    totalPoint(){
        const totalPoint = document.getElementById("totalPoint") as HTMLElement
        const total = this.players.reduce((total,nextPlayer)=> {
                return total + nextPlayer.point
        },0)
        totalPoint.innerText= total.toString()
    }

}

const players = new PlayerManage()
function addNewPlayer(){
    if ((document.getElementById("player") as HTMLInputElement).value != "") {
        let playerValue = (document.getElementById("player") as HTMLInputElement).value
        let newPlayer = new Player(playerValue);
        players.createPlayer(newPlayer);
        (document.getElementById("player") as HTMLInputElement).value = ""
    } else {
        alert("Please enter player name!")
    }
}

function increasePoint(idPlayer : number){
    console.log("increase");
    players.increasePoint(idPlayer)  
}

function decreasePoint(idPlayer : number){
    console.log("decrease");
    players.decreasePoint(idPlayer)   
}

function handlDelete(idPlayer:number){
    console.log("idPlayer", idPlayer)
   if(confirm("Do you want to delete player ?")){
    players.deletePlayer(idPlayer)
   }
}