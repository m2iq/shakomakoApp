 export function setFormatTime(time){
    if (time < 10000000000) time *= 1000;
        const Time = new Date().getTime();
      var formatPostTime = 0; 
      var formatPostTimeText = ''; 
      var formatTime = (Time -time);

      //scounds
      var formatTimeS = Math.floor(formatTime / 1000)
      formatPostTime = formatTimeS;
      formatPostTimeText = 'ث'; 

      if(formatTimeS > 59){
        //minute
        var formatTimeM = Math.floor(formatTimeS / 60)
        formatPostTime = formatTimeM;
        formatPostTimeText = 'د'; 
      }

      if(formatTimeM > 59){
        //hours
        var formatTimeH = Math.floor(formatTimeM / 60)
        formatPostTime = formatTimeH;
        formatPostTimeText = 'س'; 
      }

      if(formatTimeH >= 24){
        //days
        var formatTimeD = Math.floor(formatTimeH / 24)
        formatPostTime = formatTimeD;
        if(formatTimeD < 2){
          formatPostTime = "";
          formatPostTimeText = 'يوم'; 
        }else{
          if(formatTimeD == 2){
            formatPostTime = "";
            formatPostTimeText = 'يومان'; 
          }else{
            if(formatTimeD > 2 && formatTimeD < 11){
              formatPostTime = formatTimeD;
              formatPostTimeText = 'ايام'; 
            }else{
                if(formatTimeD > 10){
                  formatPostTime = formatTimeD;
                  formatPostTimeText = 'يوم'; 
                }
            }
          }
        }
        
       
        
      }
      if(formatPostTime < 0) return {time : ' وقت ' , text : 'غير معروف'}
      return {text : formatPostTimeText , time : formatPostTime}
      }