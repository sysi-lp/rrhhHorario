if(window.location.pathname==="/portal/mis_fichadas"){_Horario();$('.boletaInst').trigger('change')}
if(window.location.pathname==="/portal/novedades_asistencia"){_Asistencia()}
var server='https://sysi-lp.github.io/rrhhHorario/';function _Horario(){$.getScript("http://momentjs.com/downloads/moment-with-locales.min.js",function(){moment.locale("es");var Ths=(9*60*60*1000)+(40*60*1000);var Horario=obtenerHorario(Ths);var TLibre=30*60*1000;calcular(Horario,TLibre);$('select').on("change",function(){setCookie($(this).attr("dataDate"),$(this).val(),60);calcular(Horario,TLibre)});$.getScript("http://cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js",function(){$('.boletaHora').timepicker({timeFormat:'HH:mm ',interval:1,minTime:'00:00',maxTime:'22:00',startTime:'12:00',dynamic:!1,dropdown:!1,scrollbar:!1});$('.boletaInst').timepicker({timeFormat:'HH:mm',interval:1,minTime:'00:00',maxTime:'02:00',startTime:'00:00',dynamic:!1,dropdown:!1,scrollbar:!1});$('.boletaHora').on("change",function(){if($(this).val()==='')
$(this).val('00:00');var padre=$(this).parents('#resumen');if($(this).val()!=='00:00'){var A1=moment($(padre).find('.salida').html(),'HH:mm:ss');console.log(A1);var A2=moment($(this).val(),'HH:mm');var b=moment.duration(A1.diff(A2));$(padre).find('.boletaInst').val(moment.utc(b.asMilliseconds()).format("HH:mm:ss"));$(padre).find('.boletaInst').trigger('change')}else{$(padre).find('.boletaInst').val(formatearHoraH(0));$(padre).find('.boletaInst').trigger('change')}});$('.boletaInst').on("change click",function(){if($(this).val()==='')
$(this).val('00:00');setCookie($(this).attr("dataDate"),$(this).val(),60);calcular(Horario,TLibre);var padre=$(this).parents('#resumen');var A1=$(padre).find('.salida').html();$(padre).find('.boletaHora').val(A1)})})})}
function _Asistencia(){$.getScript("http://momentjs.com/downloads/moment-with-locales.min.js",function(){moment.locale("en");asistencia()})}
function calcular(Horario,TLibre){var datos=$("main div.container div.row > div.col")[0];var horaIngreso=null;var n=nombreUsuario();var dia=null;$(datos).children().each(function(i,e){var fichadas=null;var compensa=0;var enEdificio=0;switch(i){case 1:dia=obtenerDia(e);break;case 2:horaIngreso=obtenerHoraIngreso(e,Horario,n,dia);break;case 5:fichadas=obtenerFichadas(e);if(fichadas.length>0){var tiempos=calcularPermanencia(horaIngreso,fichadas,Horario,TLibre,n,dia);var infoComputada="Hora de ingreso: "+horaIngreso.format("HH:mm:ss");Cargarformulario(e,dia);mostrar(tiempos,e,infoComputada,horaIngreso,Horario,TLibre);compensa=compensacion(tiempos,horaIngreso,Horario,TLibre,n,dia);enEdificio=tiempos.enEdificio;setCookie(n+dia,compensa,60);setCookie(n+dia+'enEdificio',enEdificio,60);historicoSemana(dia,e)}
break;case 8:dia=obtenerDia(e);case 9:if(dia!==''){horaIngreso=obtenerHoraIngreso(e,Horario,n,dia)}
break;case 12:fichadas=obtenerFichadas(e);if(fichadas.length>0&&dia!==''){var tiempos=calcularPermanencia(horaIngreso,fichadas,Horario,TLibre,n,dia);var infoComputada="Hora de ingreso: "+horaIngreso.format("HH:mm:ss");Cargarformulario(e,dia);mostrar(tiempos,e,infoComputada,horaIngreso,Horario,TLibre);compensa=compensacion(tiempos,horaIngreso,Horario,TLibre);enEdificio=tiempos.enEdificio;setCookie(n+dia,compensa,60);setCookie(n+dia+'enEdificio',enEdificio,60)
historicoSemana(dia,e)}
break}})}
function obtenerHoraIngreso(elemento,Horario,n,dia){var horarioAdm=Horario.horarioIngreso.clone();var i=$(elemento).find("h1.center").html()
i=$.trim(i).slice(-8);var primerFichada=moment(i,"HH:mm:ss");var comision=getCookie(n+dia+'comision');switch(comision){case 'Entrada':return horarioAdm;break;default:if(EsControlable())
if(primerFichada>horarioAdm){return primerFichada}else{return horarioAdm}
else{return primerFichada}}}
function obtenerHorario(ThsDefault){var datos=$("main div.container div.row > div.col")[0];var horarioIngreso=moment('08:00','HH:mm');var horarioEgreso=moment('15:00','HH:mm');var Ths=ThsDefault;var ok=!1;$(datos).children().each(function(i,e){switch(i){case 4:try
{var O=$(e).find("h6.center");horarioIngreso=moment($(O[0]).html().trim(),"HH:mm");horarioEgreso=moment($(O[1]).html().trim(),"HH:mm");Ths=horarioEgreso.diff(horarioIngreso)}
catch(err)
{console.log('Error en obtener horarios 1');ok=!0}
break;case 11:if(ok){try{var O=$(e).find("h6.center");horarioIngreso=moment($(O[0]).html().trim(),"HH:mm");horarioEgreso=moment($(O[1]).html().trim(),"HH:mm");Ths=horarioEgreso.diff(horarioIngreso)}
catch(err)
{console.log('Error en obtener horarios 2')}}
break}});return{"horarioIngreso":horarioIngreso,"horarioEgreso":horarioEgreso,"Ths":Ths}}
function obtenerFichadas(elemento){var fichadas=[];var tipo='';var tipoOld='';$(elemento).find("#tabla3 tbody tr").each(function(){var format="HH:mm:ss";hora=$(this).find("td:nth(0)").html();if(hora.indexOf(" ")>0){format="DD-MM-YYYY "+format}
hh=moment(hora,format);tipo=$(this).find("td:nth(1)").html();if(tipo!=tipoOld){fichadas.push({"fichada":hh,"tipo":tipo})}
tipoOld=tipo});return fichadas}
function calcularPermanencia(horaIngreso,fichadas,Horario,TLibre,n,dia){var diff=0;var total=0;var falta=0;var comision=getCookie(n+dia+'comision');if(fichadas.length>0){switch(comision){default:fichadas[0]={"fichada":horaIngreso,"tipo":"Entrada"}}
for(var i=1;i<fichadas.length;i+=2){diff+=moment.duration(fichadas[i].fichada.diff(fichadas[i-1].fichada))}
var ahora=moment();if(fichadas[fichadas.length-1].tipo=="Entrada"){diff+=moment.duration(ahora.diff(fichadas[fichadas.length-1].fichada));ultima=ahora;falta=Horario.Ths-TLibre-diff}else{ultima=fichadas[fichadas.length-1].fichada}
total=moment.duration(ultima.diff(fichadas[0].fichada))}
return{"enEdificio":diff,"fuera":total-diff,"falta":falta,"total":total}}
function Cargarformulario(elemento,f){var d=$(elemento).find('.resumen');var l=document.getElementById("linkestilo");var t=document.getElementById("linkestilo2");var Dia=new Date();var ticks=Dia.getTime();if(l===null){$('head').append('<link type="text/css" href="'+server+'Horario.css?t='+ticks+'" rel="Stylesheet" id="linkestilo">');$('head').append('<link type="text/css" href="'+server+'bootstrap.css?t='+ticks+'" rel="Stylesheet" id="linkestilo">');$('head').append('<link type="text/css" href="http://cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css" rel="Stylesheet" id="linkestilo">')}
if(d===null||d.length===0){var response;$.ajax({type:"GET",url:server+"Horario.html?t="+ticks,async:!1,success:function(text){response=text}});$(elemento).append(response);var n=nombreUsuario();var v=getCookie(n+f+'comision');SetearComision(elemento,v,f);var v1=getCookie(n+f+'boleta');SetearBoleta(elemento,v1,f);BotonSonidoView();$('.licencia').attr("href",server+'License.txt');$('.detalleDia').click(function(e){e.preventDefault();var $this=$(this);var $datalle=$($(elemento).find('.resumen #detalleDia'));if($this.hasClass('show')){$this.removeClass('show');$this.html('<i class="fa fa-plus"></i>');$datalle.slideUp(350)}else{$this.toggleClass('show');$this.html('<i class="fa fa-minus"></i>');$datalle.slideToggle(350)}});$('.detalleSemana').click(function(e){e.preventDefault();var $this=$(this);var $datalle=$($(elemento).find('#detalleSemana'));if($this.hasClass('show')){$this.removeClass('show');$this.html('<i class="fa fa-plus"></i>');$datalle.slideUp(350)}else{$this.toggleClass('show');$this.html('<i class="fa fa-minus"></i>');$datalle.slideToggle(350)}})}}
function BotonSonidoView()
{$('.salida').click(function(){SonidoView()})}
function mostrar(tiempos,elemento,infoComputada,horaIngreso,Horario,TLibre){var d=$(elemento).find('.resumen');var compensa=compensacion(tiempos,horaIngreso,Horario,TLibre);var bole=obtenerBoletaDuration();var e=$(d).find('table tbody tr');var boleta=0;var FI=horaIngreso;if(tiempos.falta!==0){var salida=moment().add(tiempos.falta,"ms");var salida2=horaIngreso.add(Horario.Ths,"ms");if((salida>salida2||compensa<0)&&(tiempos.enEdificio>6*60*60*1000)){boleta=CalcualarBoleta(salida,salida2,tiempos.fuera,TLibre,tiempos,Horario);if(salida>salida2)
salida=salida2}else{if(salida>salida2)
salida=salida2}
salida=salida.subtract(bole.asMilliseconds(),"ms");if(salida<moment())
if($("main div.container").find('div.chau').length===0){$("main div.container").prepend('<div class="chau col s12" style="background-color:orange;"><h3 style="background-color:orange;"><center>¡¡Chauuu!! Te podes ir <i class="fa fa-hand-stop-o" aria-hidden="true"></i></center></h1></div>');parpadear();if(!window.actualizarSonido){SonidoView();alerta('Horario cumplido','info')
window.actualizarSonido=setInterval(SonidoView,10500)}}else{if(window.actualizarSonido)
window.clearInterval(window.actualizarSonido)}
if(!window.actualizarPermanencia)
window.actualizarPermanencia=setInterval(function(){calcular(Horario,TLibre)},1000)}else{if(window.actualizarSonido)
window.clearInterval(window.actualizarSonido);var d=horaIngreso.clone();salida=horaIngreso.add(tiempos.total.asMilliseconds(),"ms");salida2=d.add(Horario.Ths,"ms");if((salida>salida2||compensa<0)&&tiempos.enEdificio>6*60*60*1000){boleta=CalcualarBoleta(salida,salida2,tiempos.fuera,TLibre,tiempos,Horario)}}
boleta=CalcualarBoleta(salida,salida2,tiempos.fuera,TLibre,tiempos,Horario);$(elemento).find('span.aviso').html('');$(elemento).find('span.fuera').html(formatearHora(tiempos.fuera));$(elemento).find('span.edificio').html(formatearHora(tiempos.enEdificio));(e).find('.compensacion').html(formatearHora(compensa));$(elemento).find('span.boletaSoli').html(formatearHora(bole));if(boleta>0){$(e).find('.boleta').html(formatearHora(boleta));$(e).find('.boleta').removeClass().addClass('label label-danger boleta');boleta1=tiempos.fuera-TLibre;if(tiempos.falta!==0){}else{}}else{$(e).find('.boleta').html(formatearHora(0));$(e).find('.boleta').removeClass().addClass('boleta')}
$(elemento).find('span.salida').html(salida.format("HH:mm:ss"));$(elemento).find('.falta').html(formatearHora(tiempos.falta));var j=$(elemento).find('.resumen div.box-header .box-title')[0];$(j).html('Resumen del día( '+infoComputada+')')}
function CalcualarBoletaOld(salida,salida2,fuera,TLibre,tiempos,Horario){var boleta=0;if(salida>salida2){boleta=fuera-TLibre}else{boleta=Horario.Ths-tiempos.enEdificio-(TLibre)}
if(boleta>0)
return boleta;else return 0}
function CalcualarBoleta(salida,salida2,fuera,TLibre,tiempos,Horario){var boleta=0;var boleta1=0;var boleta2=0;boleta1=fuera-TLibre;boleta2=Horario.Ths-tiempos.enEdificio-(TLibre);if(boleta1>boleta2)
boleta=boleta1;else boleta=boleta2;if(boleta>0)
return boleta;else return 0}
function obtenerComision(e){var r='';var d=$(e).find('.resumen');var el=$(d).find('table tbody tr');if(!el.length===0){var ob=$(el).find('.comision');r=ob.val()}
return r}
function SetearComision(e,v,n,dia){var d=$(e).find('.resumen');var el=$(d).find('table tbody tr');if(el.length!==0){var ob=$(el).find('.comision');ob.val(v);n=nombreUsuario();ob.attr("dataDate",n+dia+'comision')}}
function obtenerBoleta(e){var r='';var d=$(e).find('.resumen');var el=$(d).find('table tbody tr');if(!el.length===0){var ob=$(el).find('.boletaInst');r=ob.val()}
return r}
function obtenerBoletaDuration(e,n,dia){var zero=moment('00:00','HH:mm');var r=moment.duration(zero.diff(zero));var boleta=getCookie(n+dia+'boleta');if(boleta!==''){var mboleta=moment(boleta,'HH:mm');var duration=moment.duration(mboleta.diff(zero));r=duration}
return r}
function SetearBoleta(e,v,n,dia){var d=$(e).find('.resumen');var el=$(d).find('table tbody tr');if(el.length!==0){var ob=$(el).find('.boletaInst');ob.val(v);n=nombreUsuario();ob.attr("dataDate",n+dia+'boleta')}}
function compensacion(tiempos,horaIngreso,Horario,TLibre,n,dia){var compensa=0;var comision=getCookie(n+dia+'comision');switch(comision){case 'Salida':compensa=0;break;case 'Día':compensa=0;break;default:if(tiempos.total>0){if(tiempos.falta<=0&&tiempos.fuera<=TLibre&&tiempos.enEdificio>(Horario.Ths-TLibre)){compensa=tiempos.total-Horario.Ths;var boleta=getCookie(n+dia+'boleta');if(boleta!==''){var bole=obtenerBoletaDuration(n,dia);compensa+=bole}
if(compensa<0)
compensa=0}else{compensa=tiempos.total-Horario.Ths-(tiempos.fuera-TLibre);var boleta=getCookie(n+dia+'boleta');if(boleta!==''){var bole=obtenerBoletaDuration(n,dia);compensa+=bole;if(compensa>0)compensa=0}}}}
var Tope=2*60*60*1000;if(Horario.Ths>=8*60*60*1000)
Tope=1*60*60*1000+20*60*1000;if(compensa>Tope)
compensa=Tope;return compensa}
function formatearHora(msec){var d=moment.duration(msec,'ms');return pad(d.get("h"),2)+":"+pad(d.get("m"),2)+":"+pad(d.get("s"),2)}
function formatearHoraH(msec){var d=moment.duration(msec,'ms');var h=parseInt(d.asHours());var m=moment.duration(d-moment.duration(h,'hours')).minutes();return pad(h,2)+":"+pad(m,2)}
function pad(num,size){var s=num+"";while(s.length<size)s="0"+s;return s}
function obtenerDia(elemento){var dia='';try
{dia=$(elemento).find("h6.center").html()}
catch(err)
{console.log('Error en obtener dia')}
return dia}
function setCookie(cname,cvalue,exdays){var d=new Date();d.setTime(d.getTime()+(exdays*24*60*60*1000));var expires="expires="+d.toUTCString();document.cookie=cname+"="+cvalue+";"+expires+";path=/"}
function getCookie(cname){var name=cname+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' '){c=c.substring(1)}
if(c.indexOf(name)===0){return c.substring(name.length,c.length)}}
return""}
function ProcesarDia(dia){$('#fecha_historial').val(dia);$(".btn").trigger("click")}
function diadelaSemana(semana,dia){var ok=!1;for(var i=0;i<=6;i+=1){if(semana.day(i).format('YYYYMMDD')===dia.format('YYYYMMDD')){ok=!0;break}}
return ok}
function historicoSemana(dia,elemento){var d=moment(dia,'DD-MM-YYYY');var hoy=moment(moment().format('DD-MM-YYYY'),'DD-MM-YYYY');var k=null;var compensa=0;var comp=0;var Edif=0;var msj='<li><b>Compensación:</b></li><br />';var msj2='<li><b>En Edificio:</b></li><br />';var n=nombreUsuario();for(var i=1;i<6;i+=1){if(d.day(i)<=hoy){msj+='<div class="col-md-2">';msj+='<div class="box box-default">';k=getCookie(n+d.day(i).format('DD-MM-YYYY'));if(k!==''){compensa+=(1*k);if(d.day(i)<hoy)
comp+=(1*k);msj+='<div class="box-header with-border">';msj+='	<h3 style="text-align:center;background-color:transparent;color:#444;font-variant:normal;" class="box-title">';msj+=d.day(i).format('dddd');msj+='	</h3>';msj+='</div>';msj+='<div class="box-body" style="text-align:center;">';msj+=''+formatearHora(1*k);msj+='</div>';msj+='<div style="background:#f4f4f4;font-size:13px;" class="box-footer text-center">'
msj+='	<a href="javascript:ProcesarDia(\''+d.day(i).format('DD-MM-YYYY')+'\')"> Actualizar';msj+='		<i class="fa fa-refresh"></i>';msj+='	</a>';msj+='</div>'}else{msj+='<div class="box-header with-border">';msj+='	<h3 style="text-align:center;background-color:transparent;color:#444;font-variant:normal;" class="box-title">';msj+=d.day(i).format('dddd');msj+='	</h3>';msj+='</div>';msj+='<div class="box-body" style="text-align:center;">';msj+=''+formatearHora(0);msj+='</div>';msj+='<div style="background:#f4f4f4;font-size:13px;" class="box-footer text-center">'
msj+='	<a href="javascript:ProcesarDia(\''+d.day(i).format('DD-MM-YYYY')+'\')"> Actualizar';msj+='		<i class="fa fa-refresh"></i>';msj+='	</a>';msj+='</div>'}
msj+='</div>';msj+='</div>';msj2+='<div class="col-md-2">';msj2+='<div class="box box-default">';k2=getCookie(n+d.day(i).format('DD-MM-YYYY')+'enEdificio');if(k2!==''){Edif+=(1*k2);msj2+='<div class="box-header with-border">';msj2+='	<h3 style="text-align:center;background-color:transparent;color:#444;font-variant:normal;" class="box-title">';msj2+=d.day(i).format('dddd');msj2+='	</h3>';msj2+='</div>';msj2+='<div class="box-body" style="text-align:center;">';msj2+=''+formatearHora(1*k2);msj2+='</div>';msj2+='<div style="background:#f4f4f4;font-size:13px;" class="box-footer text-center">'
msj2+='	<a href="javascript:ProcesarDia(\''+d.day(i).format('DD-MM-YYYY')+'\')"> Actualizar';msj2+='		<i class="fa fa-refresh"></i>';msj2+='	</a>';msj2+='</div>'}else{msj2+='<div class="box-header with-border">';msj2+='	<h3 style="text-align:center;background-color:transparent;color:#444;font-variant:normal;" class="box-title">';msj2+=d.day(i).format('dddd');msj2+='	</h3>';msj2+='</div>';msj2+='<div class="box-body" style="text-align:center;">';msj2+=''+formatearHora(0);msj2+='</div>';msj2+='<div style="background:#f4f4f4;font-size:13px;" class="box-footer text-center">'
msj2+='	<a href="javascript:ProcesarDia(\''+d.day(i).format('DD-MM-YYYY')+'\')"> Actualizar';msj2+='		<i class="fa fa-refresh"></i>';msj2+='	</a>';msj2+='</div>'}
msj2+='</div>';msj2+='</div>'}}
var msj1='<div class="row"><div class="col-xs-12">'+msj+'</div></div><div class="row"><div class="col-xs-12">'+msj2+'</div></div>';$(elemento).find('span.hist').html(msj1);$(elemento).find('span.s-compensacion').html(formatearHora(compensa));$(elemento).find('span.s-enedificio').html(formatearHoraH(Edif))}
function EsControlable(){var ok=!1;$("main i.tooltipped").each(function(i,e){if($(e).attr('data-tooltip')==='Controlable'){ok=!0}});return ok}
function nombreUsuario(){var N='';N=$("#header-nombre-usuario").text().trim();return N}
function asistencia(){n=nombreUsuario();$("#mi_asistencia_tbl tbody tr").each(function(index){comp=0;Edif=0;obj=null;$(this).children("td").each(function(index2){switch(index2){case 0:d=moment($(this).text(),'DD-MMM-YY');obj=$(this);break;case 1:comp+=mostraDatosComp(n,d,$(this),1);Edif+=mostraDatosEnEdif(n,d,$(this),1);break;case 2:comp+=mostraDatosComp(n,d,$(this),2);Edif+=mostraDatosEnEdif(n,d,$(this),2);break;case 3:comp+=mostraDatosComp(n,d,$(this),3);Edif+=mostraDatosEnEdif(n,d,$(this),3);break;case 4:comp+=mostraDatosComp(n,d,$(this),4);Edif+=mostraDatosEnEdif(n,d,$(this),4);break;case 5:comp+=mostraDatosComp(n,d,$(this),5);Edif+=mostraDatosEnEdif(n,d,$(this),5);break}});s=obj.html();obj.html(s+'<br/>Comp: '+formatearHoraH(comp)+'<br/>en Edif: '+formatearHoraH(Edif))})}
function mostraDatosComp(n,d,cell,i){k=getCookie(n+d.day(i).format('DD-MM-YYYY'));compensa=0;if(k!==''){compensa=(1*k)}
s=cell.html();cell.html(s+'<br/>Comp: '+formatearHora(compensa));return compensa}
function mostraDatosEnEdif(n,d,cell,i){Edif=0;k2=getCookie(n+d.day(i).format('DD-MM-YYYY')+'enEdificio');if(k2!==''){Edif=(1*k2)}
s=cell.html();cell.html(s+'<br/>en Edif: '+formatearHora(Edif));return Edif}
function parpadear(){$(".chau").fadeIn(350).delay(150).fadeOut(350,parpadear)}
function SonidoView()
{$($("#chat-message-audio")[0]).attr('src',server+'sonido.mp3');$("#chat-message-audio")[0].load();$("#chat-message-audio")[0].play()}
function dragElement(elmnt){var pos1=0,pos2=0,pos3=0,pos4=0;if(document.getElementById(elmnt.id+"header")){document.getElementById(elmnt.id+"header").onmousedown=dragMouseDown}else{elmnt.onmousedown=dragMouseDown}
function dragMouseDown(e){e=e||window.event;pos3=e.clientX;pos4=e.clientY;document.onmouseup=closeDragElement;document.onmousemove=elementDrag}
function elementDrag(e){e=e||window.event;pos1=pos3-e.clientX;pos2=pos4-e.clientY;pos3=e.clientX;pos4=e.clientY;elmnt.style.top=(elmnt.offsetTop-pos2)+"px";elmnt.style.left=(elmnt.offsetLeft-pos1)+"px"}
function closeDragElement(){document.onmouseup=null;document.onmousemove=null}}
