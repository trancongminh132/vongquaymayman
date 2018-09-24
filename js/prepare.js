
$(document).ready(function() {

	$('#wav').error(function(){
		$(this).attr('src', '/uploads/thumbnail/avatar.png');
	});
	$('a').each(function(){
		
		var hr = $(this).attr('href');
		if(hr && hr.length > 1 && hr.indexOf('#') == 0 &&  $(hr).size() > 0)
		{
			$(this).facebox({width: '600px'});
		}
	})
	
	//anh trao giai
	$('.winner_box_detail img').error(function(){
		$(this).attr('src', 'http://daugia321.vn/images/no_img.gif');
	});
	//item bidding slide
	if($('#slider .running_item').size() > 0)
	{
		var index = parseInt($('#slider .dgn_itemactive').attr('index'));
		var sindex = parseInt(parseInt(index)/3);
		if(index%3 != 0)
		{
			sindex++;
		}
		try{
			
			$('#slider').anythingSlider({startPanel: sindex});
		}
		catch(e){}
	}
	$('.running_item .link_detail').click(function(){
		location.href= $(this).attr('href');
		return false;
	});
	//change tab bid
	$('.ltbox .ctr_other').click(function(){
		window.location.href = formatUrl('/bid');
	});
	
	
	//tabs
	$('.dgn_tab a').click(function(){
		$('.dgn_tab a').removeClass('dgn_tab_active');
		$(this).addClass('dgn_tab_active');
		
		if($(this).hasClass('rule'))
		{
			$('#box_rule').css('display', 'inline-block');
			$('#box_web').css('display', 'none');
			$('#box_sms').css('display', 'none');
		}
		else
		if($(this).hasClass('dgn_tab_sms'))
		{
			$('#box_sms').css('display', 'inline-block');
			$('#box_web').css('display', 'none');
			$('#box_rule').css('display', 'none');
		}
		else
		{
			$('#box_web').css('display', 'inline-block');
			$('#box_sms').css('display', 'none');
			
			$('#box_rule').css('display', 'none');
			if($(this).hasClass('dgn_tab_mybid') && logged)
			{
				$('#bid_2 table').fadeTo('fast', 0.5);
				$.ajax({
						  url: formatUrl("/bid/bidframe?id="+$('#item_id').val()),
						  
						  success: function(data){
							$('#bid_2 table').fadeTo('fast', 1);
							$('#item_bid_val').focus();	
							$('#bid_2').html(data);
							$('#bid_2').css('display', 'block');
							$('#bid_1').css('display', 'none');
							$('#sub_info').css('display', 'block');
							$('.bid_detail .sbox_tit').css('display', 'none');
							$('#select_item').css('display', 'block');
						  }
						});
			}
			else if($(this).hasClass('dgn_tab_bid'))
			{
				$('#bid_2').css('display', 'none');
				$('#bid_1').css('display', 'block');
				$('#sub_info').css('display', 'none');
				$('.bid_detail .sbox_tit').css('display', 'block');
				$('#select_item').css('display', 'none');
			}
		}
		return false;
	});
	
	

	//reload captcha
	$('.rank_running').click(function(){
		
		$('#captcha').click();
		return false;
	});
	//verify pn
	$('#vfpn').keyup(function(){
		$('#vform .msg .dgn_red').css('display', 'none');
		
	});
	
	
	$('#vform').submit(function(){
		var v = $('#vfpn').val();
		$.ajax({
				  url: formatUrl("/user/checkPhoneNumber?input_value="+v),
				  success: function(data)
				  {
					try{
						var obj = $.parseJSON(data);
						var code = obj['code'];
						if(code != '0')
						{
							$('#vform .msg #error'+code).css('display', 'block');
						}
						else
						{
							var key = obj['key'];
							$('#vform .vf_success .key').html(key);
							$('#vform .vf_success').css('display', 'block');
							$('#frame_vf').remove();
						}
					}
					catch(e)
					{
					}
				  }
				});
		return false;
	});
	
	//bid form
	$('#bid_form').submit(function(){
	
		var bidval = $('#item_bid_val').val();
		var aucval = $('#item_id').val();
		
		if (isNaN(aucval) || aucval <= 0) {
			alert("Hãy chọn sản phẩm trước khi đặt giá!");
			
			return false;
		}
		 
		else if ((bidval=='')) {
			alert("Bạn hãy nhập giá!");
			$('#item_bid_val').focus();
			return false;
		}
		else if ($('#recaptcha_response_field').val().length == 0) {
			
			alert("Hãy nhập mã xác nhận!");
			$('#recaptcha_response_field').focus();
			return false;
			
		}
		else
		{ 
			var txt = new Array;
			var inKey = '#bid_form input';
			for(var x = 0; x < $(inKey).size(); x++)
			{
				txt[x] = $(inKey).eq(x).attr('name')+'='+$(inKey).eq(x).val();
			}
			$('#bid_form input').attr('disabled', 'disabled').blur();
			$('#loading').css('display', 'inline');
			$('#bid_2 table, .top100_scroll').fadeTo('fast', 0.5);
			$.ajax({
					  url: $('#bid_form').attr('action'),
					  data: txt.join('&'),
					  type: 'post',
					  success: function(data){
							try
							{
								setTimeout(function()
								{
									var obj = $.parseJSON(data);
									if(obj['code'] == 1)
									{
										$('#loading').css('display', 'none');
										$('#bid_form input').removeAttr('disabled');
										$('#recaptcha_response_field').val('');
										$('#bid_2 table, .top100_scroll').fadeTo('fast', 1);
										if(obj['msg'] == 'pn')
										{
											refId = 'phone_active';
											addOverlay();
											
											var vw2 = $('.phone_active').width()/2;
											var vh2 = $('.phone_active').height()/2;
											$('.phone_active').css({'display': 'block',
																	'top': ($(window).height()/2-vh2+$(window).scrollTop())+'px',
																	'left': ($(window).width()/2-vw2)+'px'});
											
										}
										else
										{
											alert(obj['msg']);
										}
									}
									else
									{
										$('#price .xu').html(obj['coin']);
										$('#price .gold').html(obj['gold']);
										$('#recaptcha_response_field').blur();
										setTimeout(function(){
											
											$('.bid_left').each(function(){
												$(this).html(obj['bidleft']);
											})
											
											
											$.ajax({
												url: formatUrl("/bid/top100?id="+$('#item_id').val()),
												
												success: function(data){
												$('.top100_scroll').html(data);
												
												},
												complete: function(){
												$('#bid_2 table, .top100_scroll').fadeTo('fast', 1);
												$('#bid_form')[0].reset();
												$('.dgn_tab_mybid').click();
																						
												
												$('#bid_form input').removeAttr('disabled');
												$('#recaptcha_response_field').val('');
												
												}
											});
										}, 1000);
									}
								}, 3000);
								
								
							}
							catch(e)
							{
								alert(e);
							}
							
							
						},
						error: function(){
							alert('Hệ thống đang bận bạn hãy thử lại trong giây lát');
						},
						complete: function()
						{
							//reload captcha
							$('#captcha').click();
							$('#loading').css('display', 'none');
						}
					});

		}
		return false;
		
	});
	
	
	$('#reload_top100').click(function(){
		if(reloadTop100 == 0)
		{
			reloadTop100 = 1;
			getTop100();
		}
	});
	
/*
	top100itv = setInterval(function(){
			getTop100();
				
		}, 30000);
*/	
	
	//redirect bid
	$('.module_bid .running_item').click(function(){
		setActiveItem(this);
		window.location.href = formatUrl($(this).attr('href'));
	});
	
	$('#bid_select_item').change(function(){
		var v  = $(this).val();
		if(v.length > 0)
		{
			$('#slider .running_item').each(function(){
				if($(this).attr('href').indexOf('/bid/'+v) == 0)
				{
					window.location.href = $(this).attr('href')+'#mybid';
				}
			})
			//var selectedIndex = $("#bid_select_item option").index($("#bid_select_item option:selected"));
			//window.location.href = formatUrl('/bid?id='+v+'&p='+(parseInt(selectedIndex/3)+1)+'#mybid');
		}
	});
	var arrHref = location.href.split('#');
	if(arrHref[1] == 'mybid')
	{
		$('.dgn_tab .dgn_tab_mybid').click();
	}
	
	//end redirect bid
	
	//view winner button
	$('#view_winner_detail').click(function(){
		window.location.href = formatUrl('/winner');
	});
	//winner
	
	var getwinner = 0;
	$('.module_winner .running_item').click(function(){
		
		if(getwinner == 1)
		{
			return false;
		}
		getwinner = 1;
		if($('.dgn_itemactive').attr('item_id') != $(this).attr('item_id'))
		{
			setActiveItem(this);
		}
		$('.bigbox_table2 tr').each(function(){
			if($('.bigbox_table2 tr').index(this) > 0)
				$(this).remove();
		});
		/*
		if(environ != 'dev')
		{
			//get winner
			$.ajax({
							url: formatUrl("/winner/showWinner/itemId/"+$(this).attr('item_id')),
						 
							success: function(data)
							{
							getwinner = 0;
							try{
								var obj = $.parseJSON(data);
								$('#wav').attr('src', obj['avatar']);
								$('#wna').html(obj['fullname']);
								$('#wpr').html(obj['price']);
								$('#witemname').html(obj['item_name']);
								$('#win_time').html(obj['bid_time']);
								//clear tr
								
								while($('#top5 tr').size() > 1)
								{
									$('#top5 tr').eq(1).remove();
									
								}
								
								var arr = new Array();
								for(i = 0; i < obj['top5'].length; i++)
								{
									cobj = obj['top5'][i];
									arr[i] = '<tr><td>'+(i+1)+'</td><td>'+(cobj['fullname'])+'</td><td>'+(cobj['phone'])+'</td><td>'+(cobj['price'])+'</td><td>'+(cobj['amount'])+'</td></tr>';
								}
								
								$('#top5').append(arr.join(''));
								
								
								if(obj['mybid'])
								{
									
									var mybid = obj['mybid'];
									var len = mybid.length;
									var data = new Array(len)
									for(i = 0; i < len; i++)
									{
										data[i] = '<tr><td>'+(i+1)+'</td><td>'+mybid[i].price+'</td><td>'+mybid[i].timestamp+'</td><td>'+mybid[i].same+'</td><td>'+mybid[i].small+'</td><td><span class="rank_'+mybid[i].class+'">&nbsp;</span></td></tr>';
									}
									$('.bigbox_table2').append(data.join(''));
								}
								
							}
							catch(e)
							{
								alert(e);
							}
							}
						});
		}
		else*/
		{
			location.href=$(this).attr('href');
		}
	});
	/*
	if(typeof(environ) != 'undefined')
	if(environ != 'dev')
		$('.module_winner .dgn_itemactive').click();
	*/
	//chat box
	var contentHeight = 40;
	var defaultContent = 'Hãy chia sẽ ý kiến của bạn...';
	$('#dgn_comment #content').focus(function(){
		if($(this).val() == defaultContent)
		{
			$(this).val('');
		}
	});
	
	$('#dgn_comment #content').blur(function(){
		if($(this).val().length==0)
		{
			$(this).val(defaultContent);
		}
	});
	
	
	$('#dgn_comment #content').keyup(function(){
		var val = $(this).val();
		var ar = val.split("\n");
		
		$(this).css('height', (contentHeight+16*(ar.length-1))+'px');
	});
	$('#chat_form').submit(function(){
		var val = $('#dgn_comment #content').val();
		if(val == defaultContent || val.length == 0)
		{
			$('#dgn_comment #content').focus();
			alert('Bạn hãy nhập nội dung thảo luân');
			return false;
		}
		else
		{
			$('#chat_form .combtn').attr('disabled', 'disabled');
			$()
			$.ajax({
					  url: formatUrl("/chat"),
					  data: "content="+val,
					  type: 'post',
					  success: function(data){
						$('#dgn_comment #content').val(defaultContent);
						$('#dgn_comment #content').css('height', contentHeight+'px');
						$('#reload_comment').click();
					  },
						complete: function(){
							$('#chat_form .combtn').removeAttr('disabled');
						}
						
					});
		}
		return false;
	});
	
	//paging
	$('#dgn_comment').click(function(){
		setPaging();
		
	})
	setPaging();
	//reload comment
	$('#reload_comment').click(function(){
		
		$(this).attr('disabled', 'disabled');
		var self = this;
		setTimeout(function(){
			$(self).removeAttr('disabled');
		}, 10000);
		
		var href = formatUrl($(this).attr('href'));
		$('#commented').fadeTo('fast', 0.5);
		$.ajax({
				  url: href,				 
				  success: function(data){
					$('#commented').html(data);
					$('#commented').fadeTo('fast', 1);
					$('#dgn_comment').click();
				  }
				});
	});
	
	//question
	$('.question').click(function(){
		var index = $('.question').index(this);
		var html = $('.answer div').eq(index).html();
		$.msg({ autoUnblock : false, 
					bgPath:"/images/", 
					content: html,
					afterBlock: function(){
						
						$('#jquery-msg-content').css('width', '600px').css('left', ($(window).width()/2-300)+'px');
						
						var self = this;
						refId = 'jquery-msg-content';
						addButtonCloseOverlay();
						$('#'+closeOverlayId).click(function(){
								
								self.unblock();
						});
					}
					
				});
		
	});
	
	//backward blog
	$('.blog_nguoc').click(function(){
		var index = $('.blog_nguoc').index(this);
		var html = $('.wbox .description').eq(index).html();
		$.msg({ autoUnblock : false, 
					bgPath:"/images/", 
					content: html,
					afterBlock: function(){
						
						$('#jquery-msg-content').css('width', '600px').css('left', ($(window).width()/2-300)+'px');
						
						var self = this;
						refId = 'jquery-msg-content';
						addButtonCloseOverlay();
						$('#'+closeOverlayId).click(function(){
								
								self.unblock();
						});
					}
					
				});
		return false;
	});
	
	//login
	$('#join_bid, .bigbox_menu_send, .bigbox_menu_his').click(function(){
		var href = $(this).attr('href');
		if(!logged && $('#view_winner_detail').size() == 0)
		{
			alert('Bạn hãy đăng nhập để tham gia đấu giá');
			
		}
		else
		{
			if(typeof href == 'undefined')
				window.location.href= formatUrl('/bid');
			else
				window.location.href = formatUrl(href);
		}
		return false;
	});
	$('body').click(function(){
		$('.userimg img').error(function(){
		$(this).attr('src', '/uploads/thumbnail/avatar.png');
	});
	});
	
	$('body').click();
	
	
	$('.login-title').click(function(){
		$('.formLogin').css('display', 'block');
		$('.innerForm').css('display', 'block');
		return false;
	});
	
	$('#wrapper').click(function(){
		$('.innerForm').css('display', 'none');
	});
	
	/*
	//scroll top 100
	$('.top100_scroll').scroll(function(){
		
		jQuery.scrollTo.window().queue([]).stop(); 
	});
	*/
	//charging
	var mc_flow = null;
	
	var itvOverlayCharge = null;
	$('#btn_payment').click(function(){
		if (mc_flow == null && logged)
		{
			addOverlay();
			
			$.ajax({  url: formatUrl("/coin/token"),
						dataType: 'json',
					  success: function(data){
							var defError = 'Hệ thống đang bận, bạn hãy thử lại sau giây lát';
							try{
								
								var obj = data;
								if(obj['return_code'] == '00')
								{
									mc_flow = new NGANLUONG.apps.MCFlow({trigger:'btn_payment', url: obj['link']});
									
									$('#btn_payment').click();
									itvOverlayCharge = setInterval(function(){
										
										if($('#PPDGFrame').size() == 0)
										{
											removeOverlay();
											clearInterval(itvOverlayCharge);
										}
									}, 1000);
								}
								else
								{
									alert(obj['msg']);
								}
							}
							catch(e)
							{alert(e);
								
							}
					  },
						error: function(){
							alert('error');
						}
			});
		}
		else if(!logged)
		{
			alert('Để nạp xu bạn phải đăng nhập');
		}
	});
	
	//process border running item
	setActiveItem();
	
	//card charge
	$('.card').click(function(){
		if(logged)
		{
			var val = $(this).attr('value');
			refId = 'card-box';
			addOverlay();
			$('#card-form')[0].reset();
			$('#card_name').html($(this).attr('name'));
			$('#card-box').css({'display': 'block',
								'z-index': $('#'+overlayId).css('z-index')+1,
								'position': 'absolute',
								'top': ($(window).height()/2-$('#card-box').height()+$('body').offset().top)+'px',
								'left': ($(window).width()/2-$('#card-box').width()/2)+'px'});
			$('#card-type').val(val);
			
			refId = 'card-box';
			
			if(val == 'VIETTEL')
			{
				$('#card-form #serial').removeClass('hidden');
			}
			else
			{
				$('#card-form #serial').addClass('hidden');
			}
		}
		else
		{
			alert('Để nạp xu bạn phải đăng nhập');
		}
	});
	
	var cformSubmit = false;
	$('#card-form').submit(function(){
		
		if(!cformSubmit)
		{
			
			cformSubmit = true;
			var params = new Array($('#card-form input').size());
			
			var i = 0;
			$('#card-form input').each(function(){
				params[i] = $(this).attr('name')+'='+$(this).val();
				$(this).attr('disabled', 'disabled');
				i++;
			});
			$('#loading').css('display', 'inline');
			$('#card-form .dgn_button').attr('disabled', 'disabled')
			$.ajax({  data: params.join('&'),
					  url: $(this).attr('action'),				 
					  type: 'post',
					  success: function(data){
							$('#card-form input').removeAttr('disabled');
							$('#loading').css('display', 'none');
							$('#card-form .dgn_button').removeAttr('disabled');
							cformSubmit = false;
							//$('#captcha-img').click();
							try
							{
								var obj = $.parseJSON(data);
								if(obj['code'] == 0)
								{
									alert('Nạp xu thành công');
									location.reload(true);
								}
								else
								{
									$('#card-form .dgn_red').eq(1).html(obj['msg']);
								}
							}
							catch(e)
							{
							}
					  }
					});
			
			
		}
		
		return false;
	});
	
	$(document).keyup(function(e) {
	
	  if (e.keyCode == 27) { //esc
		if($('#'+overlayId).size() >0 )
		{
			$('#'+overlayId).click();
		}
	  }  
	});
	
	reChargingCheck();
	
	$('#my_winner .dgn_button').click(function(){
		$('#pop_winner #item_id').val($(this).attr('item_id'));
		$('#pop_winner .name').html($(this).attr('item_name'));
		$('#pop_winner .my_winner_img').attr('src', $(this).attr('img_src'));
		$('#pop_winner .price').html($(this).attr('price'));
		$('#pop_winner .xu').html($(this).attr('xu'));
		return false;
	});
	
});

function exchange(o)
{
	if(!confirm('Bạn muốn đổi sản phẩm ?'))
	{
		return false;
	}
	var pr = $(o).parent();
	var opSelected = pr.find('#present_ex:checked').val();
	var itemId = pr.find('#item_id').val();
	$(o).hide();
	$.ajax({  data: {item_id: itemId, option: opSelected},
							url: '/winner/exchange',				 
							type: 'post',
							success: function(data){
									var obj = $.parseJSON(data);
									alert(obj.msg);
									window.location.reload();
									
							}
						});
	
}

function reChargingCheck(chargeId)
{
	var k = '.bigbox_table2 .recheck';
	if(chargeId)
		k = '.bigbox_table2 #trans_'+chargeId;
	
	$(k).click(function(){
		
		$(this).attr('src', '/images/loading.gif');
		var self = this;
		var chargeId = $(self).attr('val');
		$.ajax({  data: 'id='+chargeId,
							url: '/coin/user_check',				 
							type: 'post',
							success: function(data){
									var obj = $.parseJSON(data);
									alert(obj.msg);
									if(obj.code == 1)
									{
										if(obj.count && obj.count < 3)
										{
											$(self).parent().html('<span id="trans_'+chargeId+'">30</span>');
											countDownCheck(chargeId);
										}
										else
										{
											$(self).parent().html('');
										}
									}
									
							}
						});
	});
}

function countDownCheck(chargeId)
{
		
		var val = $('#trans_'+chargeId).html();
		val = parseInt(val);
		if(val -1 > 0)
		{
			val--;
			$('#trans_'+chargeId).html(val);
			setTimeout(function(){countDownCheck(chargeId)}, 1000);
		}
		else
		{
			$('#trans_'+chargeId).parent().html('<img alt="Kiểm tra lại giao dịch" title="Kiểm tra lại giao dịch" src="http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-5/16/undo-icon.png" id="trans_'+chargeId+'" val="'+chargeId+'" class="recheck"/>');
			reChargingCheck(chargeId)
		}
	}
	
function formatUrl(url)
{
	if(url.indexOf('index.php') == -1 && !no_script_name)
	{
		url = '/index.php'+url
	}
	return url;
}

var top100itv;
var reloadTop100 = 0;

function getTop100()
{
	$('#reload_top100').attr('disabled', 'disabled');
	if($('#item_id').size() == 0)
	{
		clearInterval(top100itv);
		return false;
	}
	$('.top100_scroll').fadeTo('fast', 0.5);
	$.ajax({
						url: formatUrl("/bid/top100?id="+$('#item_id').val()),
						
						success: function(data){
							$('.top100_scroll').html(data);
							
							
						},
						complete: function(){
							$('.top100_scroll').fadeTo('fast', 1);
							setTimeout(function(){reloadTop100 = 0; $('#reload_top100').removeAttr('disabled');}, 10000);
						}
					});
}

function setActiveItem(obj){
	$('.border-right-bid').css('display', 'block');
	if(obj)
	{
		$('.dgn_itemactive').removeClass('dgn_itemactive').addClass('dgn_itembid');
	
		$(obj).removeClass('dgn_itembid');
		$(obj).addClass('dgn_itemactive');
		$(obj).find('.border-right-bid').css('display', 'none');
	}
	var acIndex = $('.dgn_itemactive').attr('index');
	$('.running_item[index='+(acIndex-1)+'] .border-right-bid').css('display', 'none');
	$('.dgn_itemactive .border-right-bid').css('display', 'none');
	
}
function setPaging()
{
	$('#dgn_comment .compage a').click(function(){
		var href = formatUrl($(this).attr('href'));
		$('#commented').fadeTo('fast', 0.5);
		$.ajax({
				  url: href,				 
				  success: function(data){
					$('#commented').fadeTo('fast', 1);
					$('#commented').html(data);
					$('#dgn_comment').click();
					 $('html,body').animate({
								scrollTop: $("#chat_form").offset().top},
								'slow');

				  }
				});
		return false;
	});
	
	//khi sang trang ko bi loi avatar
	$('body').click();
}

var closeOverlayId = 'close_overlay';
var overlayId = 'overlay';
var refId = '';

function addOverlay()
{
	if($('#'+overlayId).size() == 0)
	{
		$('body').append('<div id="'+overlayId+'"></div>');
	}
	//alert($(document).css('padding'));
	$('#'+overlayId).css({	display: 'block', 
							width: ($(document).width())+'px',
							height: $(document).height()+'px',
							background: '#000',
							opacity: '0.6',
							filter: 'Alpha(opacity=60)',
							position: 'absolute',
							'z-index': '80'});
	$('#'+overlayId).click(function(){removeOverlay();});
	addButtonCloseOverlay();
}
function addButtonCloseOverlay()
{
	if(refId.length > 0)
	{
		if($('#'+closeOverlayId).size() == 0)
			$('#'+refId).prepend('<span id="'+closeOverlayId+'"><img width="16" src="/images/close.gif"/></span>');
		$('#'+closeOverlayId).css({position: 'relative',
								 cursor: 'pointer',
								 'float': 'right',
								 top: 0+'px',
								 padding: '5px',
								 'z-index': 1001});
		$('#'+closeOverlayId).click(function(){$('#'+overlayId).click(); });
	}
}
function removeOverlay()
{
	$('#'+overlayId).remove();
	if(refId.length > 0)
	{
		$('#'+refId).css('display', 'none');
		
	}
}


function couponCharge(obj)
{
	
	if(!logged)
	{
		alert('Bạn hãy đăng nhập để thực hiện chức năng này');
		return;
	}
	var input = $(obj).parent().find('input').first();
	var cp = input.val();
	if(cp.length < 8)
	{
		alert('Mã coupon không hợp lệ');
		return false;
	}
	input.attr('disabled', 'disabled');
	$.ajax({  url: '/coin/coupon',
						data: {coupon: cp},
					  success: function(data){
							alert(data);
							input.removeAttr('disabled').val('');
					  }
			});
			
}
