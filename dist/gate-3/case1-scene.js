/* CASE1_INVESTIGATION：桌面物件在所有證物視窗返回後持續存在。 */
window.c1scene=function(){
 app.innerHTML=`<section class="room"><div class="shade"></div><header class="top"><div><b>案件一｜還沒賣出的大麻</b><br><small>深夜案件審查室</small></div></header><div class="case-head">先查看卷宗中的證物，釐清案件事實。</div><button class="c1-folder" aria-label="案件一卷宗">案件一<br><small>案件審查卷宗</small></button><button class="obj bagobj" onclick="c1bag()" aria-label="透明證物袋"></button><button class="obj phoneobj" onclick="c1phone()" aria-label="被扣押的手機"></button><button class="obj recordobj" onclick="c1record()" aria-label="交易查核紀錄"></button></section>`;
};
