

function main() {


    document.addEventListener('click', function () {
        setTimeout(greet, 100);
    });

    window.addEventListener("load", function () {
        setTimeout(greet, 100);
    });


}



function greet() {
    const el = document.getElementsByClassName('tousLesMessages')[0];
    const collection = el.children;


    for (let i = 0; i < collection.length; i++) {
        console.log(document.getElementById("main"))
        if (collection.length <= 2) {
            document.getElementById("main").style.height = "100vh";
        }
        else if (collection.length >= 2) {

            document.getElementById("main").style.height = "100%";
        }
    }
}




main();



