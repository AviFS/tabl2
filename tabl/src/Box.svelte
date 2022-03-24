<!-- contenteditable div is preferable, but it has very weird behavior with making new lines and adding <br> and <div></div> nodes inconsistently nested
contenteditable div fixes the scrolling issue when you get to the bottom, instead growing dynamically
however i'd have to rewrite getLineNumber() and getLine() which i wasn't able to do because of it's weird behavior -->

<main>
    <textarea id='left' class="child"></textarea>
    <div id='right' class="child"></div>
</main>


<style>
    main {
        border: 1px solid hsla(0, 0%, 100%, .4);
        border-bottom: 0px;
        border-radius: 5px 5px 0px 0px;
        display:flex;
        padding-left: 1em;
        padding-right: 1em;
        padding-top: 1em;
        /* padding-top: .8em; */
        max-width: 55em;
        /* min-height: 60em; */
        min-height: 100%;
        margin: auto;
        margin-top: 20px;

        /* box-shadow: 3px 4px hsla(224, 19%, 13%, 1); */
    }

    main, #left {
        /* background-color: rgb(32,36,47); */
        /* background-color: hsla(224, 19%, 15%, 1); */
        color: rgb(204,202,194);
    }

    #right               { color: hsla(160, 62%, 74%, 1); }
    #left                { color: hsla(200, 100%, 73%, 1); }

    #right>.row.dim {
        color: hsla(160, 62%, 74%, .9);
    }
    /* Make right side show new lines between divs, even when a div is empty */
    #right>.row::after {
        content: "\A";
        white-space: pre;
    }

    #right {
        text-align: right;
        white-space: pre;
    }

    #left {
        resize: none;
        border: none;
    }

    #left, #right {
    /* font-family: monospace; */
    /* font-size: 15px; */
    /* font-size: 22.5px; */
    font-size: 15px;
    line-height: 180%;
    padding: 0px;
    margin: 0px;
    }

    .child {
    /* min-width: 20px;
    min-height: 200px; */
    /* border: 1px grey solid; */
    }



    main, #left, #right {
    /* background-color: hsla(224, 25%, 16%, 1); */
    }

    #left {
        flex: 2;
        outline: none;
    }

    #right {
        flex: 1;
    }

    /* @media (max-width:600px) {  */
        main {
            border: none !important;
        }
    /* } */
</style>