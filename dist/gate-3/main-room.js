/* Gate 3 主審查室：只負責案件桌面與共用入口。 */
(function(){
  const key='rules-city-gate3-v1';
  const state=()=>window.s||window.state||{};
  const completed=(id)=>((state().completed)||[]).includes(id);
  const summaries={
    c1:{title:'案件一｜還沒賣出的大麻',clues:'🔍 <b>文義解釋</b><br>從法律文字可能具有的意義理解規範。<br><br>🧩 <b>體系解釋</b><br>從法律規範彼此之間的關係理解條文意義。',result:'司法院釋字第792號<br>本案重新檢視了過去實務對「販賣」一詞的理解。'},
    c2:{title:'案件二｜農作物災害補助申請案',clues:'🤝 <b>誠實信用原則</b><br>法律適用不只逐字勾選條件，也要檢視條件形成的方式。',result:'申請人雖符合表面文字條件，卻故意製造取得補助的條件，因此不應依原決定核准。'},
    c3:{title:'案件三｜地是我的，為什麼不能拆？',clues:'🚫 <b>禁止權利濫用原則</b><br>權利的行使不能超過法律容許的界線。',result:'本案重新衡量土地所有權與擋土牆所涉的具體利益。'}
  };
  window.openCompletedCaseSummary=function(caseId){const summary=summaries[caseId];if(!summary)return;modal(`<h2>${summary.title}</h2><p><b>✓ 已結案</b></p><h3>本案取得線索</h3><p>${summary.clues}</p><h3>案件結果</h3><p>${summary.result}</p><button class="primary" onclick="returnToGate3Desk()">返回案件桌面</button>`)};
  window.showGate3Complete=function(){
    const q=state();
    if(!['c1','c2','c3'].every(id=>(q.completed||[]).includes(id))){desk();return}
    app.innerHTML=`<section class="clear gate3-complete"><div><div class="kicker">GATE 3 COMPLETE</div><h1>解釋的邊界</h1><h2>任務完成</h2><p>你已完成三件案件的審查。</p><div class="gate3-concepts"><p>🔍 文義解釋</p><p>🧩 體系解釋</p><p>🤝 誠實信用原則</p><p>🚫 禁止權利濫用原則</p></div><p class="note">完成頁下方提供「返回規則之城」與「重新挑戰本關」。</p></div></section>`;
  };

  window.title=function(){app.innerHTML=`<section class="room official-start"><div class="shade"></div><div class="title"><div class="kicker">GATE 3</div><h1>解釋的邊界</h1><button class="start-btn" onclick="desk()">開始</button></div></section>`};
  window.desk=function(){
    const q=state(),done=q.completed||[];
    const next=done.includes('c1')?(done.includes('c2')?(done.includes('c3')?0:3):2):1;
    const c2Done=done.includes('c2'),c3Done=done.includes('c3');
    const folder=(id,classes,name,subtitle,action)=>`<button data-case="${id}" class="physical-folder ${classes}" onclick="${action}"><b>${name}</b><br><small>${subtitle}</small></button>`;
    const c1=folder('c1',done.includes('c1')?'closed':'','案件一',done.includes('c1')?'還沒賣出的大麻<br>✓ 已結案':'還沒賣出的大麻',done.includes('c1')?"openCompletedCaseSummary('c1')":next===1?'case1()':"toast('卷宗尚未開啟。')");
    const c2=folder('c2','two '+(c2Done?'':next===2?'':'lock'),'案件二',c2Done?'農作物災害補助申請案<br>✓ 已結案':'農作物災害補助申請案',c2Done?"openCompletedCaseSummary('c2')":next===2?'case2Start()':"toast('卷宗尚未開啟。')");
    const c3=folder('c3','three '+(c3Done?'':next===3?'':'lock'),'案件三',c3Done?'地是我的，為什麼不能拆？<br>✓ 已結案':'地是我的，為什麼不能拆？',c3Done?"openCompletedCaseSummary('c3')":next===3?'case3Start()':"toast('卷宗尚未開啟。')");
    app.innerHTML=`<section class="room"><div class="shade"></div><header class="top"><div><b>GATE 3｜解釋的邊界</b><br><small>深夜案件審查室</small></div></header><div class="folder-stack">${c1}${c2}${c3}</div><button class="lawbook real" aria-label="法規資料" onclick="${next===0?'finalLaw()':"toast('先處理桌上的案件。')"}">法規資料</button><button class="journal" onclick="journal()">案件紀錄本</button><button class="restart" onclick="restartGate3()">↻ 重新開始</button></section>`;
  };
  window.returnToGate3Desk=function(){
    closeModal();
    const q=state();
    q.stage='desk';
    window.s=q;window.state=q;
    if(['c1','c2','c3'].every(id=>(q.completed||[]).includes(id))){window.showGate3Complete();return}
    desk();
  };
  window.restartGate3=function(){modal(`<h2>重新開始第三關</h2><p>選擇要從哪一件案件重新開始。</p><div class="restart-options"><label class="restart-option"><input type="radio" name="restart-from" value="c1"><span><b>案件一</b><small>從頭重新審查三件案件</small></span></label><label class="restart-option"><input type="radio" name="restart-from" value="c2"><span><b>案件二</b><small>保留案件一完成狀態</small></span></label><label class="restart-option"><input type="radio" name="restart-from" value="c3"><span><b>案件三</b><small>保留案件一、二完成狀態</small></span></label></div><div class="restart-actions"><button class="choice" onclick="closeModal()">取消</button><button class="primary" onclick="confirmRestartGate3()">確定重新開始</button></div>`) };
  window.confirmRestartGate3=function(){
    const start=document.querySelector('input[name="restart-from"]:checked')?.value;
    if(!start){toast('請先選擇要從哪一件案件開始。');return}
    const completed=start==='c1'?[]:start==='c2'?['c1']:['c1','c2'];
    s={...state(),stage:'desk',case1:[],case2:[],case3:[],completed,case1Completed:completed.includes('c1'),case2Completed:completed.includes('c2'),case3Completed:false,gate3Completed:false};
    ['case1Runtime','case2Runtime','case3Runtime','case1ActiveModal','case2ActiveModal','case3ActiveModal','pendingCase1Transition','pendingCase2Transition','pendingCase3Transition'].forEach(name=>delete s[name]);
    window.s=s;window.state=s;
    save();
    closeModal();
    desk();
  };
  window.journal=function(){const d=(state().completed||[]);modal(`<h2>案件紀錄本</h2>${d.includes('c1')?'<p>🔍 文義解釋<br>🧩 體系解釋</p>':'<p class="note">目前尚無案件紀錄。</p>'}${d.includes('c2')?'<p>🤝 誠實信用</p>':''}${d.includes('c3')?'<p>🚫 禁止權利濫用</p>':''}`)};
  title();
})();
