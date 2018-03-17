// window.onload = function()
// {
// 	main();
// }
// const INIT_NUM_FONT = 11;
// var font_size_table = [];
// var is_time_to_rewrite = true;
// for(let i = 0; i < 30; i++)
// {
// 	if(i <= 11)
// 	{
// 		font_size_table.push(380);
// 	}
// 	else
// 	{
// 		var tmp = (font_size_table[i - 1] * (i - 1)) / i;
// 		font_size_table.push(tmp);
// 	}
// }
// function dealWithFontSize(cur_len, input_box)
// {
// 	if(cur_len < 30)
// 	{
// 		input_box.style.fontSize = font_size_table[cur_len] + '%';
// 	}
// 	else
// 	{
// 		alert('OVERFLOW');
// 		is_time_to_rewrite = true;
// 	}
// }

// function main()
// {
// 	var input_box = document.getElementById('input-box');
// 	var all_btn = document.getElementsByTagName('button');
// 	for(let i = 0; i < all_btn.length; i++)
// 	{
// 		var item = all_btn[i];
// 		if(item.id == 'ce')
// 		{
// 			item.addEventListener('click', function () {
// 				input_box.innerText = "0";
// 				is_time_to_rewrite = true;
// 			});
// 		}
// 		else if(item.id == 'back-space')
// 		{
// 			item.addEventListener('click', function () {
// 				input_box.innerText = input_box.innerText.slice(0, -1); // delete the 
// 				if(input_box.innerText.length == 0)
// 				{
// 					input_box.innerText = "0";
// 					is_time_to_rewrite = true;
// 				}
// 				dealWithFontSize(input_box.innerText.length, input_box);
// 			});
// 		}
// 		else if(item.id == 'equal')
// 		{
// 			item.addEventListener('click', function () {
// 				var ans;
// 				try
// 				{
// 					ans = eval(input_box.innerText);
// 				}
// 				catch(error)
// 				{
// 					ans = 'invaid';
// 				}
// 				if(ans !== 'invalid')
// 				{
// 					ans = String(parseFloat(ans).toFixed(6));
// 					// log(ans, ans.length);
// 					var last_bit_index;
// 					for(let i = ans.length - 1; i >= 0; i--)
// 					{
// 						if(ans[i] != '0')
// 						{
// 							last_bit_index = i;
// 							if(ans[i] == '.') last_bit_index--;
// 							break;
// 						}
// 					}
// 					ans = ans.slice(0, last_bit_index + 1);
// 					// log(ans);
// 				}
// 				input_box.innerText = ans;
// 				dealWithFontSize(input_box.innerText.length, input_box);
// 				is_time_to_rewrite = true;
// 			});
// 		}
// 		else
// 		{
// 			item.addEventListener('click', function () {
// 				if(is_time_to_rewrite)  
// 				{
// 					// console.log(input_box.innerText);
// 					input_box.innerText = "";
// 					is_time_to_rewrite = false;
// 				}
// 				var tmp = this.innerText;
// 				if(tmp == '×')
// 				{
// 					tmp = '*';
// 				}
// 				else if (tmp == "÷")
// 				{
// 					tmp = '/';
// 				}
// 				input_box.innerText += tmp;
// 				dealWithFontSize(input_box.innerText.length, input_box);
// 			});
// 		}
// 	}
// }
// 