let defaultProperties={
    text: "",
    "font-weight": "",
    "font-style": "",
    "text-decoration": "",
    "text-align": "left",
    "background-color": "white",
    "color": "black",
    "font-family": "Noto sans",
    "font-size": 14

}

let cellData={

    "sheet1":{
        
    }
}

let slelectedSheet="sheet1";
let totalSheets=1;


$(document).ready(function(){
 let cellContainer=$(".input-cell-container");

 for(let i=1;i<=100;i++){
     let ans="";

     let n=i;
     while(n>0){
         let rem=n%26;
         if(rem==0){
         	ans="Z"+ans;
         	n=Math.floor(n/26)-1;
         }else{
         	ans=String.fromCharCode(rem-1+65)+ans;
         	n=Math.floor(n/26);
         }
     }

     let column=$(`<div class="column-name colId-${i}" id="colCod-${ans}">${ans}</div>`);
     $(".column-name-container").append(column);
     let row=$(` <div class="row-name" id="rowId-${i}">${i}</div>`)
     $(".row-name-container").append(row);   
  

 }

 for(let i=1;i<=100;i++){
 	let row=$(` <div class="cell-row"></div>`);
 	for(let j=1;j<=100;j++){
 		 let colCode=$(`.colId-${j}`).attr("id").split("-")[1];
 		 let column=$(`<div class="input-cell" contenteditable="false" id="row-${i}-col-${j}" data="code-${colCode}"></div>`);
 		 row.append(column);

 	}
 	$(".input-cell-container").append(row);
 }

  $(".align-icon").click(function(){
     $(".align-icon.selected").removeClass("selected");
     $(this).addClass("selected");
  });
  

  $(".style-icon").click(function(){
  	$(this).toggleClass("selected");
  });

  $(".input-cell").click(function(e){
    if(e.ctrlKey){
       let[rowId,colId]=getRowCol(this);
       // top cell
       if(rowId>1){
         let topCellSelected=$(`#row-${rowId-1}-col-${colId}`).hasClass("selected");
         //console.log(topCellSelected);
          if(topCellSelected){
            $(this).addClass("top-cell-selected");
            $(`#row-${rowId-1}-col-${colId}`).addClass("bottom-cell-selected");
          }
       }
       //bottom cell
       if(rowId<100){
         let bottomCellSelected=$(`#row-${rowId+1}-col-${colId}`).hasClass("selected");
          if(bottomCellSelected){
            $(this).addClass("bottom-cell-selected");
            $(`#row-${rowId+1}-col-${colId}`).addClass("top-cell-selected");
           }
       }
       // left cell
       if(colId>1){
         let leftCellSelected=$(`#row-${rowId}-col-${colId-1}`).hasClass("selected");
          if(leftCellSelected){
            $(this).addClass("left-cell-selected");
            $(`#row-${rowId}-col-${colId-1}`).addClass("right-cell-selected");
          }
       }
       // right cell
       if(colId<100){
         let rightCellSelected=$(`#row-${rowId}-col-${colId+1}`).hasClass("selected");
          if(rightCellSelected){
            $(this).addClass("right-cell-selected");
            $(`#row-${rowId}-col-${colId+1}`).addClass("left-cell-selected");
          }
       }
        
        $(this).addClass("selected");
       

 
    }
    else{
  	  $(".input-cell.selected").removeClass("selected");

      // add by me->>
      $(".input-cell.bottom-cell-selected").removeClass("bottom-cell-selected");
      $(".input-cell.top-cell-selected").removeClass("top-cell-selected");
      $(".input-cell.right-cell-selected").removeClass("right-cell-selected");
      $(".input-cell.left-cell-selected").removeClass("left-cell-selected");

      //till here end<-----
  	  $(this).addClass("selected");
    }
    changeHeader(this);
  });


    function changeHeader(ele){
        let[rowId,colId]=getRowCol(ele);
        let cellInfo=defaultProperties;
        if(cellData[slelectedSheet][rowId]&&cellData[slelectedSheet][rowId][colId]){
            cellInfo=cellData[slelectedSheet][rowId][colId];
        }

        cellInfo["font-weight"] ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected");
        cellInfo["font-style"] ? $(".icon-italic").addClass("selected"):$(".icon-italic").removeClass("selected");
        cellInfo["text-decoration"] ? $(".icon-underline").addClass("selected"):$(".icon-underline").removeClass("selected");

        

        let alignment=cellInfo["text-align"];
        $(".align-icon.selected").removeClass("selected");
        $(".icon-align-"+alignment).addClass("selected");

    }





  $(".input-cell").dblclick(function(){
     $(".input-cell.selected").removeClass("selected");
     $(this).addClass("selected");
     $(this).attr("contenteditable","true");
     $(this).focus();
  });

  $(".input-cell").blur(function(){
     $(".input-cell.selected").attr("contenteditable","false");

  });


 $(".input-cell-container").scroll(function(){
    $(".column-name-container").scrollLeft(this.scrollLeft);
     $(".row-name-container").scrollTop(this.scrollTop);
 });

 });
//////////document deafult end///////

 function getRowCol(ele){

  let idArray=$(ele).attr("id").split("-");
  let rowId=parseInt(idArray[1]);
  let colId=parseInt(idArray[3]);
  return [rowId,colId];

 }
 function updateCell(property,value,defaultPossible){
    $(".input-cell.selected").each(function(){
        //change the css property
        $(this).css(property,value);
        //storing the cell data
        let[rowId,colId]=getRowCol(this);
        if(cellData[slelectedSheet][rowId]){
            if(cellData[slelectedSheet][rowId][colId]){
                // just update the value
                cellData[slelectedSheet][rowId][colId][property]=value;
            }
            else{
                // first create the cell with default proprety
                cellData[slelectedSheet][rowId][colId]={...defaultProperties};
                cellData[slelectedSheet][rowId][colId][property]=value;

            }
        }else{
            // row does not exist
            cellData[slelectedSheet][rowId]={};
            cellData[slelectedSheet][rowId][colId]={...defaultProperties};
            cellData[slelectedSheet][rowId][colId][property]=value;
        }
        if(defaultPossible && (JSON.stringify(cellData[slelectedSheet][rowId][colId])===JSON.stringify(defaultProperties))){
            delete cellData[slelectedSheet][rowId][colId];
            if( Object.keys(cellData[slelectedSheet][rowId]).length==0){
                delete cellData[slelectedSheet][rowId];
            }

        }

    });

    console.log(cellData );
 }
 $(".icon-bold").click(function(){
   if ($(this).hasClass("selected")){
       //possible that might be the default property
        updateCell("font-weight","",true);
    }else{
        updateCell("font-weight","bold",false);
    }


 });

 $(".icon-italic").click(function(){
    if($(this).hasClass("selected")){
        updateCell("font-style","",true);
    }else{
        updateCell("font-style","italic",false);
    }


 });

 $(".icon-underline").click(function(){
    if($(this).hasClass("selected")){
        updateCell("text-decoration","",true);
    }else{
        updateCell("text-decoration","underline",false);
    }


 });
 $(".icon-align-left").click(function() {

     if(!$(this).hasClass("selected")) {
        updateCell("text-align","left",true);
    }
});

$(".icon-align-center").click(function() {
    if(!$(this).hasClass("selected")) {
        updateCell("text-align","center",false);
    }
});

$(".icon-align-right").click(function() {
    if(!$(this).hasClass("selected")) {
        updateCell("text-align","right",false);
    }
});
$(".font-family-selector").change(function(){
    updateCell("font-family",$(this).val());
});
$(".font-size-selector").change(function(){
    updateCell("font-size",$(this).val());
});

