
  $(document).ready(function() { 
    var url = window.location.href;
    var host =  window.location.hostname;
    var title = $('title').html();
    title = escape(title); //clean up unusual characters
 
    var twit = 'http://twitter.com/home?status='+title+'%20'+url;
    var facebook = 'http://www.facebook.com/sharer.php?u='+url
   
    var gplus= 'https://m.google.com/app/plus/x/?v=compose&content='+title;
    var content = $('meta[name=description]').eq(0).attr('content');
		var linkhay = 'http://linkhay.com/submit?link_url='+url+'&link_title='+title+'&link_content='+content+'&link_media=0&utm_source=partner&utm_medium=embedded&utm_campaign=button';
		var zing = 'http://link.apps.zing.vn/share?u='+url+'&t='+title;
    var tbar = '<div id="socializethis">';
		
		tbar += '<a href="'+linkhay+'" id="linkhay" title="Share on linkhay"><img src="/social/linkhay.gif"  alt="Share on linkhay" width="24" height="24" /></a>';
    tbar += '<a href="'+zing+'" id="zingme" title="Share on zingme"><img src="/social/zingme.gif"  alt="Share on zingme" width="24" height="24" /></a>';
		tbar += '<a href="'+gplus+'" id="gplus" title="Share on Google Plus"><img src="/social/google.png"  alt="Share on Google Plus" width="24" height="24" /></a>';
		tbar += '<a href="'+twit+'" id="twit" title="Share on twitter"><img src="/social/twitter.png"  alt="Share on Twitter" width="24" height="24" /></a>';
    tbar += '<a href="'+facebook+'" id="facebook" title="Share on Facebook"><img src="/social/facebook.png"  alt="Share on facebook" width="24" height="24" /></a>';
    
		
		
		
    tbar += '</div>';
		$('#share').append(tbar);
		
		$('#socializethis, #share').hover(function(){
			var posY = $(this).position().top;
			var posX = $(this).position().left;
			var aSize = $('#socializethis img').size();
			var w = (aSize*30);
			
			$('#socializethis').css({	
																'margin-left': (-w/2+6)+'px',
																display: 'block',
																width: w+'px'});
		},
		function(){
			$('#socializethis').css('display', 'none');
		}
		);
		
		$('#socializethis a').click(function(){
			$('#socializethis').css('display', 'none');
			window.open($(this).attr('href'), 'share_window', 'width=800,height=600,scollbars=0');
			return false;
		});
  });