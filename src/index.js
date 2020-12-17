const {$} = require('./web-libs');
window.$ = $;
document.getElementsByTagName("iframe")[0].onload = function()
{
    const world = this.contentWindow.world;
    ide = world.children[0];
    ide.toggleAppMode(true);
}
$('#run').on('click', function(){ ide.pressStart() });