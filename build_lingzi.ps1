# PowerShell script to build the complete Lingzi dataset, assets, master template, overview page, and detail pages.
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Starting Lingzi system build..."

# 1. Read raw lingzi html
$rawHtml = [System.IO.File]::ReadAllText("lingzi_raw.html", [System.Text.Encoding]::UTF8)
$pattern = '<div class="[^"]*ap-soulessence-child[^"]*"\s+data-param0="([^"]*)"\s+data-param1="([^"]*)"\s+data-param2="([^"]*)"\s+data-param3="([^"]*)">[\s\S]*?<img[^>]+src="([^"]+)"[\s\S]*?<span class="soulessence-name">([^<]+)<\/span><a href="([^"]+)"'
$matches = [regex]::Matches($rawHtml, $pattern)

Write-Host "Found $($matches.Count) items in lingzi_raw.html"

# Translation & Mapping Tables
$classMap = @{
    "爆发" = @{ id = "burst"; name = "Bạo Phát" }
    "破坏" = @{ id = "destruction"; name = "Phá Hoại" }
    "猛攻" = @{ id = "assault"; name = "Mãnh Công" }
    "增幅" = @{ id = "amplification"; name = "Tăng Phúc" }
    "赋予" = @{ id = "bestow"; name = "Phó Dữ" }
    "无"   = @{ id = "general"; name = "Chung" }
}

$statMap = @{
    "暴击率"   = @{ id = "crit_rate"; name = "Tỉ Lệ Bạo Kích"; lv1 = "2.39%"; lv100 = "20%" }
    "攻击"     = @{ id = "atk"; name = "Tấn Công"; lv1 = "3.58%"; lv100 = "30%" }
    "防御"     = @{ id = "def"; name = "Phòng Ngự"; lv1 = "4.78%"; lv100 = "40%" }
    "生命"     = @{ id = "hp"; name = "Sinh Mệnh"; lv1 = "4.78%"; lv100 = "40%" }
    "暴击伤害" = @{ id = "crit_dmg"; name = "Sát Thương Bạo Kích"; lv1 = "4.78%"; lv100 = "40%" }
    "治疗加成" = @{ id = "healing_bonus"; name = "Tăng Trị Liệu"; lv1 = "2.39%"; lv100 = "20%" }
    "超限强度" = @{ id = "overlimit_intensity"; name = "Cường Độ Siêu Hạn"; lv1 = "3.58%"; lv100 = "30%" }
    "超限会心率"= @{ id = "overlimit_crit"; name = "Hội Tâm Siêu Hạn"; lv1 = "2.39%"; lv100 = "20%" }
    "破韧值"   = @{ id = "toughness_break"; name = "Trị Phá Nhẫn"; lv1 = "3.58%"; lv100 = "30%" }
}

$itemMeta = @{
    "修行中" = @{ id = "tuhanhtrung"; name = "Tu Hành Trung"; intro = "Ánh ban mai xuyên qua rừng trúc, Bội Bội thức giấc sớm để tu hành. Dù thân nhỏ bé nhưng nghĩa hiệp chẳng đổi, quyền cước nhanh như gió thoảng."; skill_lv1 = "Người mang gây sát thương thuộc tính Quang sau đó, sát thương thuộc tính Địa của bản thân tăng 24%, duy trì 5 giây."; skill_lvmax = "Người mang gây sát thương thuộc tính Quang sau đó, sát thương thuộc tính Địa của bản thân tăng 48%, duy trì 5 giây." }
    "唤灵" = @{ id = "hoanlinh"; name = "Hoán Linh"; intro = "Tiếng chuông ngân vang thức tỉnh vạn vật, triệu gọi linh hồn tinh tú hội tụ dẫn lối."; skill_lv1 = "Sau khi người mang thi triển kỹ năng lưu trường, hồi phục 12.5% giới hạn sinh mệnh cho đồng minh xung quanh và tăng 6% tấn công, duy trì 24 giây."; skill_lvmax = "Sau khi người mang thi triển kỹ năng lưu trường, hồi phục 25% giới hạn sinh mệnh cho đồng minh xung quanh và tăng 12% tấn công, duy trì 24 giây." }
    "厨房的秘密" = @{ id = "bimatnhabep"; name = "Bí Mật Nhà Bếp"; intro = "Hương thơm ngào ngạt lan tỏa từ góc bếp ấm áp, nơi ẩn chứa những công thức diệu kỳ nuôi dưỡng sức mạnh."; skill_lv1 = "Sau khi gây sát thương bạo kích, sát thương kỹ năng Siêu Hạn tăng 20%, duy trì 8 giây."; skill_lvmax = "Sau khi gây sát thương bạo kích, sát thương kỹ năng Siêu Hạn tăng 40%, duy trì 8 giây." }
    "羽夜的思念" = @{ id = "noinhovuda"; name = "Nỗi Nhớ Vũ Dạ"; intro = "Đêm dài lặng lẽ ngắm nhìn những chiếc lông vũ rơi nhẹ, gửi gắm tâm tư theo ngọn gió phương xa."; skill_lv1 = "Khi bản thân có lá chắn, tỉ lệ bạo kích tăng 15% và sát thương bạo kích tăng 20%."; skill_lvmax = "Khi bản thân có lá chắn, tỉ lệ bạo kích tăng 30% và sát thương bạo kích tăng 40%." }
    "碧空之下" = @{ id = "duoibautroixanh"; name = "Dưới Bầu Trời Xanh"; intro = "Dưới vòm trời xanh thẳm vô tận, đôi cánh tự do vút bay vượt qua muôn trùng mây gió."; skill_lv1 = "Tấn công trúng mục tiêu bị phá nhẫn sẽ gây thêm sát thương vật lý bằng 60% tấn công."; skill_lvmax = "Tấn công trúng mục tiêu bị phá nhẫn sẽ gây thêm sát thương vật lý bằng 120% tấn công." }
    "一梦千约" = @{ id = "nhatmongthienuoc"; name = "Nhất Mộng Thiên Ước"; intro = "Một giấc mộng ngàn năm khắc sâu lời hẹn ước, thời gian dù trôi lòng son chẳng phai."; skill_lv1 = "Tăng 15% hiệu quả trị liệu và khi trị liệu sẽ tăng 10% tấn công cho mục tiêu, duy trì 10 giây."; skill_lvmax = "Tăng 30% hiệu quả trị liệu và khi trị liệu sẽ tăng 20% tấn công cho mục tiêu, duy trì 10 giây." }
    "花之舞" = @{ id = "dieumuacuahoa"; name = "Điệu Múa Của Hoa"; intro = "Cánh hoa nhẹ nhàng xoay chuyển trong gió sớm, từng bước vũ đạo tựa như khúc ca của tự nhiên."; skill_lv1 = "Sau khi thi triển kỹ năng nguyên tố, tăng 18% sát thương nguyên tố tương ứng, duy trì 12 giây."; skill_lvmax = "Sau khi thi triển kỹ năng nguyên tố, tăng 36% sát thương nguyên tố tương ứng, duy trì 12 giây." }
    "新生" = @{ id = "tansinh"; name = "Tân Sinh"; intro = "Mầm xanh đâm chồi từ lòng đất mẹ, biểu tượng cho sức sống mãnh liệt không bao giờ lụi tàn."; skill_lv1 = "Khi sinh mệnh bản thân dưới 50%, hồi phục ngay lập tức 25% sinh mệnh và tăng 20% phòng ngự trong 10 giây."; skill_lvmax = "Khi sinh mệnh bản thân dưới 50%, hồi phục ngay lập tức 50% sinh mệnh và tăng 40% phòng ngự trong 10 giây." }
    "充能时间" = @{ id = "thoigiannapnang"; name = "Thời Gian Nạp Năng"; intro = "Khoảnh khắc tích tụ năng lượng trước khi giải phóng cơn thịnh nộ nghiền nát mọi chướng ngại."; skill_lv1 = "Tốc độ hồi phục năng lượng Siêu Hạn tăng 25%, khi đầy năng lượng tăng 15% tấn công."; skill_lvmax = "Tốc độ hồi phục năng lượng Siêu Hạn tăng 50%, khi đầy năng lượng tăng 30% tấn công." }
    "月下秘仪" = @{ id = "binghiduoitrang"; name = "Bí Nghi Dưới Trăng"; intro = "Nghi lễ cổ xưa được tổ chức dưới ánh trăng vằng vặc, đánh thức nguồn sức mạnh tiềm ẩn."; skill_lv1 = "Tấn công kẻ địch đang chịu trạng thái bất lợi sẽ tăng 24% sát thương bạo kích."; skill_lvmax = "Tấn công kẻ địch đang chịu trạng thái bất lợi sẽ tăng 48% sát thương bạo kích." }
    "热火朝天" = @{ id = "hunghuckhithe"; name = "Hừng Hực Khí Thế"; intro = "Ngọn lửa nhiệt huyết bùng cháy trong tim người chiến binh, hăng hái tiến bước."; skill_lv1 = "Mỗi khi đánh bại một kẻ địch, tấn công tăng 5%, tối đa cộng dồn 4 tầng."; skill_lvmax = "Mỗi khi đánh bại một kẻ địch, tấn công tăng 10%, tối đa cộng dồn 4 tầng." }
    "点滴积累" = @{ id = "tichluytungchut"; name = "Tích Lũy Từng Chút"; intro = "Từng giọt nước nhỏ dần tạo nên biển lớn, sự kiên trì từng ngày sẽ đạt đến đỉnh cao."; skill_lv1 = "Mỗi 3 giây trong chiến đấu, tấn công tăng 2%, tối đa cộng dồn 10 tầng."; skill_lvmax = "Mỗi 3 giây trong chiến đấu, tấn công tăng 4%, tối đa cộng dồn 10 tầng." }
    "迫不及待" = @{ id = "nonglongkhonhin"; name = "Nóng Lòng Khó Nhịn"; intro = "Trực giác chiến đấu mách bảo cơ hội đã đến, không thể chờ đợi thêm một khắc nào."; skill_lv1 = "Khi bắt đầu trận chiến, tăng 25% tốc độ di chuyển và 15% tấn công trong 15 giây."; skill_lvmax = "Khi bắt đầu trận chiến, tăng 50% tốc độ di chuyển và 30% tấn công trong 15 giây." }
    "捕捉「闪亮」" = @{ id = "batlaylaplanh"; name = "Bắt Lấy Lấp Lánh"; intro = "Đôi mắt tinh tường bắt trọn tia sáng lấp lánh giữa muôn vàn tinh tú chuyển động."; skill_lv1 = "Sau khi né đòn hoàn hảo, đòn tấn công tiếp theo chắc chắn bạo kích."; skill_lvmax = "Sau khi né đòn hoàn hảo, đòn tấn công tiếp theo chắc chắn bạo kích và tăng thêm 50% sát thương bạo kích." }
    "利箭锋芒" = @{ id = "muitensacben"; name = "Mũi Tên Sắc Bén"; intro = "Mũi tên xé toạc không gian mang theo uy lực sắc bén vô song nhắm thẳng mục tiêu."; skill_lv1 = "Sát thương tầm xa tăng 18%, cự ly càng xa sát thương càng tăng tối đa 30%."; skill_lvmax = "Sát thương tầm xa tăng 36%, cự ly càng xa sát thương càng tăng tối đa 60%." }
    "碧水激浪" = @{ id = "nuocbiecsongtrao"; name = "Nước Biếc Sóng Trào"; intro = "Dòng nước xanh biếc cuộn trào sóng gió, cuốn phăng mọi phòng tuyến của kẻ địch."; skill_lv1 = "Gây sát thương thuộc tính Thủy có 30% cơ hội tăng 20% tỉ lệ bạo kích trong 6 giây."; skill_lvmax = "Gây sát thương thuộc tính Thủy có 30% cơ hội tăng 40% tỉ lệ bạo kích trong 6 giây." }
    "破坏大王" = @{ id = "daivuongphahoai"; name = "Đại Vương Phá Hoại"; intro = "Sức công phá mạnh mẽ khiến mọi kết cấu kiên cố nhất cũng phải vỡ tan thành từng mảnh vụn."; skill_lv1 = "Tăng 30% hiệu suất phá nhẫn đối với kẻ địch có giáp kiên cố."; skill_lvmax = "Tăng 60% hiệu suất phá nhẫn đối với kẻ địch có giáp kiên cố." }
    "猛攻对决" = @{ id = "quyetdaumanhcong"; name = "Quyết Đấu Mãnh Công"; intro = "Đứng vững giữa trận địa đối đầu trực diện, lấy công làm thủ áp đảo đối phương."; skill_lv1 = "Khi tấn công liên tiếp không bị gián đoạn, sát thương tăng 6% mỗi giây, tối đa 24%."; skill_lvmax = "Khi tấn công liên tiếp không bị gián đoạn, sát thương tăng 12% mỗi giây, tối đa 48%." }
    "林间舞会" = @{ id = "vuhoirungsau"; name = "Vũ Hội Rừng Sâu"; intro = "Khúc nhạc hoan ca giữa rừng xanh sâu thẳm, vạn linh cùng tề tựu reo vui."; skill_lv1 = "Tăng 20% sinh mệnh tối đa cho toàn đội khi ở trong trạng thái chiến đấu."; skill_lvmax = "Tăng 40% sinh mệnh tối đa cho toàn đội khi ở trong trạng thái chiến đấu." }
    "夜栖鸮语" = @{ id = "loicudemtrungu"; name = "Lời Cú Đêm Trú Ngụ"; intro = "Tiếng cú vẳng lại trong màn đêm tịch mịch, báo hiệu những điềm báo huyền bí."; skill_lv1 = "Kỹ năng hỗ trợ tăng 15% hiệu lực và hồi phục năng lượng cho đồng đội."; skill_lvmax = "Kỹ năng hỗ trợ tăng 30% hiệu lực và hồi phục năng lượng cho đồng đội." }
    "彻底清理！" = @{ id = "dondeptrietde"; name = "Dọn Dẹp Triệt Để!"; intro = "Một đường quét dọn sạch sẽ chiến trường, không để sót bất kỳ hiểm họa nào."; skill_lv1 = "Đòn đánh lan gây thêm 40% sát thương lên các mục tiêu xung quanh."; skill_lvmax = "Đòn đánh lan gây thêm 80% sát thương lên các mục tiêu xung quanh." }
    
    # SR Items
    "汁石就是力量" = @{ id = "thachnuoclasucmanh"; name = "Thạch Nước Là Sức Mạnh"; intro = "Khối thạch chứa đựng tinh chất khoáng thạch, nguồn năng lượng thuần khiết dồi dào."; skill_lv1 = "Tăng 15% hiệu quả phá nhẫn."; skill_lvmax = "Tăng 30% hiệu quả phá nhẫn." }
    "可以吃吗" = @{ id = "coanduockhong"; name = "Có Ăn Được Không"; intro = "Ánh nhìn tò mò trước một vật thể lấp lánh kỳ lạ, phân vân không biết có nuốt được chăng."; skill_lv1 = "Tăng 12% khả năng phá vỡ thế trận kẻ thù."; skill_lvmax = "Tăng 24% khả năng phá vỡ thế trận kẻ thù." }
    "功夫是这样的！" = @{ id = "kungfulathenay"; name = "Kungfu Là Thế Này!"; intro = "Từng chiêu từng thức uyển chuyển dứt khoát, biểu diễn bí quyết võ học chân truyền."; skill_lv1 = "Tăng 12% cường độ kỹ năng khi tung đòn."; skill_lvmax = "Tăng 24% cường độ kỹ năng khi tung đòn." }
    "飞行试验" = @{ id = "thunghiembay"; name = "Thử Nghiệm Bay"; intro = "Những sải cánh đầu tiên cất lên giữa bầu trời bao la, khởi đầu hành trình thám hiểm."; skill_lv1 = "Tăng 10% cường độ Siêu Hạn và 10% tốc độ lướt."; skill_lvmax = "Tăng 20% cường độ Siêu Hạn và 20% tốc độ lướt." }
    "狩猎姿态" = @{ id = "tuthesanban"; name = "Tư Thế Săn Bắn"; intro = "Hạ thấp trọng tâm, nín thở tập trung cao độ chờ đợi thời khắc con mồi sơ hở."; skill_lv1 = "Tăng 10% hội tâm Siêu Hạn."; skill_lvmax = "Tăng 20% hội tâm Siêu Hạn." }
    "星晚的追忆" = @{ id = "kyuccuatinhvan"; name = "Ký Ức Của Tinh Vãn"; intro = "Bầu trời đêm đầy sao gợi nhớ những kỷ niệm xưa cũ đọng lại nơi đáy mắt."; skill_lv1 = "Tăng 12% sát thương đòn đánh liên kích."; skill_lvmax = "Tăng 24% sát thương đòn đánh liên kích." }
    "风语之愿" = @{ id = "nguyenuocloigio"; name = "Nguyện Ước Lời Gió"; intro = "Nguyện ước thì thầm gửi vào làn gió nhẹ, mong manh nhưng tràn đầy hy vọng."; skill_lv1 = "Tăng 16% sát thương bạo kích."; skill_lvmax = "Tăng 32% sát thương bạo kích." }
    "陪伴" = @{ id = "donghanh"; name = "Đồng Hành"; intro = "Bên nhau trên mọi dặm đường xa xôi, sự hiện diện của bạn là điểm tựa lớn nhất."; skill_lv1 = "Tăng 14% sát thương bạo kích khi có đồng đội bên cạnh."; skill_lvmax = "Tăng 28% sát thương bạo kích khi có đồng đội bên cạnh." }
    "甜点时光" = @{ id = "thoigianmonngot"; name = "Thời Gian Món Ngọt"; intro = "Giờ phút nghỉ ngơi thư giãn thưởng thức bánh ngọt, hồi phục tinh thần phấn chấn."; skill_lv1 = "Tăng 12% cường độ hỗ trợ buff."; skill_lvmax = "Tăng 24% cường độ hỗ trợ buff." }
    "归来" = @{ id = "trove"; name = "Trở Về"; intro = "Bước chân phong trần sau chuỗi ngày viễn chinh, hướng về mái ấm thân thương."; skill_lv1 = "Tăng 15% trị phá nhẫn sau khi chuyển đổi nhân vật."; skill_lvmax = "Tăng 30% trị phá nhẫn sau khi chuyển đổi nhân vật." }
    "药草大丰收" = @{ id = "boithuthaoduoc"; name = "Bội Thu Thảo Dược"; intro = "Giỏ đầy ắp thảo dược tươi tốt ngát hương thơm sau một ngày hái thuốc trên sườn non."; skill_lv1 = "Tăng 15% lượng hồi phục sinh mệnh."; skill_lvmax = "Tăng 30% lượng hồi phục sinh mệnh." }
    "来者何人" = @{ id = "nguoidenlaai"; name = "Người Đến Là Ai"; intro = "Tiếng gõ cửa bất ngờ vang lên phá tan không gian yên ắng giữa trưa hè."; skill_lv1 = "Tăng 12% cường độ chiêu thức."; skill_lvmax = "Tăng 24% cường độ chiêu thức." }
    "折纸寄情" = @{ id = "gapgiayguitinh"; name = "Gấp Giấy Gửi Tình"; intro = "Từng nếp gấp tỉ mỉ gửi gắm trọn vẹn tình cảm chân thành tới phương xa."; skill_lv1 = "Tăng 12% cường độ tấn công."; skill_lvmax = "Tăng 24% cường độ tấn công." }
    "女仆的疗养日" = @{ id = "ngaynghiduongcuahaugai"; name = "Ngày Nghỉ Dưỡng Của Hầu Gái"; intro = "Một ngày thảnh thơi hiếm hoi gác lại mọi bổn phận để tận hưởng tách trà chiều ấm cúng."; skill_lv1 = "Tăng 14% trị phá nhẫn."; skill_lvmax = "Tăng 28% trị phá nhẫn." }
    "暗中观察" = @{ id = "quansattrongtoi"; name = "Quan Sát Trong Tối"; intro = "Ánh mắt cảnh giác dõi theo từng chuyển động từ bóng râm rậm rạp."; skill_lv1 = "Tăng 10% sinh mệnh tối đa."; skill_lvmax = "Tăng 20% sinh mệnh tối đa." }
    "失控飞行" = @{ id = "baymatkiemsoat"; name = "Bay Mất Kiểm Soát"; intro = "Cơn gió lốc bất ngờ cuốn phăng hướng lái, một chuyến phiêu lưu không định trước."; skill_lv1 = "Tăng 12% cường độ kỹ năng."; skill_lvmax = "Tăng 24% cường độ kỹ năng." }
    "恶作剧前奏" = @{ id = "khucdaodautreuchoc"; name = "Khúc Dạo Đầu Trêu Chọc"; intro = "Nụ cười lém lỉnh hé lộ một trò đùa tinh quái sắp sửa được tung ra."; skill_lv1 = "Tăng 16% sát thương bạo kích."; skill_lvmax = "Tăng 32% sát thương bạo kích." }
    "攀高的幼崽" = @{ id = "thunonleocao"; name = "Thú Non Leo Cao"; intro = "Chú thú non dũng cảm bám từng mỏm đá chênh vênh để vươn tới tầm nhìn xa hơn."; skill_lv1 = "Tăng 15% phòng ngự."; skill_lvmax = "Tăng 30% phòng ngự." }
    "一点都不痛" = @{ id = "khongdauchutnao"; name = "Không Đau Chút Nào"; intro = "Cố gắng tỏ ra cứng cỏi dù đầu gối vừa va phải một hòn đá to tướng."; skill_lv1 = "Tăng 12% sinh mệnh tối đa."; skill_lvmax = "Tăng 24% sinh mệnh tối đa." }
    "安睡吧，宝贝" = @{ id = "ngungoannhebeyeu"; name = "Ngủ Ngoan Nhé Bé Yêu"; intro = "Khúc hát ru êm đềm xoa dịu giấc nồng, chở che qua màn đêm yên tĩnh."; skill_lv1 = "Tăng 8% tấn công cơ bản."; skill_lvmax = "Tăng 16% tấn công cơ bản." }
    "星之种" = @{ id = "hatgiongngoisao"; name = "Hạt Giống Ngôi Sao"; intro = "Hạt mầm phát sáng ánh lân tinh diệu kỳ, gieo mầm hy vọng cho tương lai."; skill_lv1 = "Tăng 10% sinh mệnh tối đa."; skill_lvmax = "Tăng 20% sinh mệnh tối đa." }
    "未来之星" = @{ id = "ngoisaotuonglai"; name = "Ngôi Sao Tương Lai"; intro = "Ánh sáng rực rỡ hé lộ tiềm năng vô hạn của người anh hùng mai sau."; skill_lv1 = "Tăng 12% cường độ Siêu Hạn."; skill_lvmax = "Tăng 24% cường độ Siêu Hạn." }
    "耕种之时" = @{ id = "thoidiemgieotrong"; name = "Thời Điểm Gieo Trồng"; intro = "Mùa màng bắt đầu khi đất trời ấm áp, nông dân hăng say cày xới."; skill_lv1 = "Tăng 10% sinh mệnh."; skill_lvmax = "Tăng 20% sinh mệnh." }
    "编织温暖" = @{ id = "detnenamap"; name = "Dệt Nên Ấm Áp"; intro = "Đôi bàn tay khéo léo đan từng sợi len mềm mại xua tan cái lạnh mùa đông."; skill_lv1 = "Tăng 12% phòng ngự."; skill_lvmax = "Tăng 24% phòng ngự." }
    "拉锯！战！" = @{ id = "keocuachien"; name = "Kéo Cưa! Chiến!"; intro = "Trận chiến giằng co quyết liệt từng tấc đất không bên nào chịu nhượng bộ."; skill_lv1 = "Tăng 8% tấn công."; skill_lvmax = "Tăng 16% tấn công." }
    "嘟噜的自我修养" = @{ id = "sutuduongcuadolo"; name = "Sự Tu Dưỡng Của Đô Lỗ"; intro = "Cẩm nang học tập và rèn luyện nghiêm túc của sinh vật Đô Lỗ đáng yêu."; skill_lv1 = "Tăng 8% tấn công."; skill_lvmax = "Tăng 16% tấn công." }
    "加大火力" = @{ id = "tangcuonghoaluc"; name = "Tăng Cường Hỏa Lực"; intro = "Tiếp thêm nhiên liệu cho ngọn lửa bùng cháy dữ dội áp đảo phòng tuyến."; skill_lv1 = "Tăng 12% trị phá nhẫn."; skill_lvmax = "Tăng 24% trị phá nhẫn." }
    "美味稍等片刻" = @{ id = "monngonchochutlat"; name = "Món Ngon Chờ Chút Lát"; intro = "Món hầm thơm phức trên bếp than hồng sắp sửa chín tới phục vụ thực khách."; skill_lv1 = "Tăng 10% sinh mệnh."; skill_lvmax = "Tăng 20% sinh mệnh." }
    "精打细算" = @{ id = "tinhtoanchily"; name = "Tính Toán Chi Ly"; intro = "Ghi chép tỉ mỉ từng đồng ngân lượng, quản lý tài nguyên khoa học."; skill_lv1 = "Tăng 8% tấn công."; skill_lvmax = "Tăng 16% tấn công." }
    "今日风平浪静" = @{ id = "homnaysongyenbienlang"; name = "Hôm Nay Sóng Yên Biển Lặng"; intro = "Mặt biển phẳng lặng như gương phản chiếu bầu trời thanh bình rộng lớn."; skill_lv1 = "Tăng 8% tấn công."; skill_lvmax = "Tăng 16% tấn công." }
    "星之意志" = @{ id = "ychicuasao"; name = "Ý Chí Của Sao"; intro = "Ý chí kiên định bất khuất được hun đúc từ tinh thần của các vì sao xa."; skill_lv1 = "Tăng 8% tấn công."; skill_lvmax = "Tăng 16% tấn công." }

    # R Items
    "怀疑" = @{ id = "nghingo"; name = "Nghi Ngờ"; intro = "Dấu hỏi thoáng hiện trong tâm trí trước những hiện tượng lạ kỳ."; skill_lv1 = "Tăng 6% tấn công."; skill_lvmax = "Tăng 12% tấn công." }
    "黯星花" = @{ id = "hoasaotoi"; name = "Hoa Sao Tối"; intro = "Bông hoa nở trong đêm đen mang sắc màu huyền bí tĩnh mịch."; skill_lv1 = "Tăng 8% phòng ngự."; skill_lvmax = "Tăng 16% phòng ngự." }
    "五谷丰登" = @{ id = "ngucocthuhoach"; name = "Ngũ Cốc Thu Hoạch"; intro = "Mùa màng bội thu, kho lẫm đầy ắp thóc vàng tạ ơn đất trời."; skill_lv1 = "Tăng 6% tấn công."; skill_lvmax = "Tăng 12% tấn công." }
    "传承" = @{ id = "truyenthua"; name = "Truyền Thừa"; intro = "Ngọn lửa tri thức và ý chí được truyền đời qua các thế hệ."; skill_lv1 = "Tăng 8% phòng ngự."; skill_lvmax = "Tăng 16% phòng ngự." }
    "璇枢" = @{ id = "tuyenxu"; name = "Tuyền Xu"; intro = "Trục ngọc xoay vần dẫn hướng các thiên thể trên bầu trời."; skill_lv1 = "Tăng 8% sinh mệnh."; skill_lvmax = "Tăng 16% sinh mệnh." }
    "魂引" = @{ id = "hondan"; name = "Hồn Dẫn"; intro = "Ánh sáng dẫn dắt linh hồn lạc lối tìm về cội nguồn an yên."; skill_lv1 = "Tăng 6% tấn công."; skill_lvmax = "Tăng 12% tấn công." }
    "小小木雕" = @{ id = "tuonggonho"; name = "Tượng Gỗ Nhỏ"; intro = "Tác phẩm điêu khắc mộc mạc mang theo phước lành bình an."; skill_lv1 = "Tăng 8% phòng ngự."; skill_lvmax = "Tăng 16% phòng ngự." }
    "远古秘钥" = @{ id = "chiakhoacodai"; name = "Chìa Khóa Cổ Đại"; intro = "Chiếc chìa khóa rỉ sét phong ấn cánh cửa bí mật nghìn năm."; skill_lv1 = "Tăng 8% phòng ngự."; skill_lvmax = "Tăng 16% phòng ngự." }
    "淳朴之音" = @{ id = "amthanhmocmac"; name = "Âm Thanh Mộc Mạc"; intro = "Giai điệu dân dã trong trẻo cất lên giữa chốn đồng quê êm ả."; skill_lv1 = "Tăng 8% sinh mệnh."; skill_lvmax = "Tăng 16% sinh mệnh." }
    "命土" = @{ id = "menhtho"; name = "Mệnh Thổ"; intro = "Tấc đất ngọn nguồn nuôi dưỡng muôn loài sinh sôi nảy nở."; skill_lv1 = "Tăng 6% tấn công."; skill_lvmax = "Tăng 12% tấn công." }
    "往事" = @{ id = "chuyencu"; name = "Chuyện Cũ"; intro = "Những ký ức xưa cũ trôi về theo từng trang nhật ký nhuốm màu thời gian."; skill_lv1 = "Tăng 8% phòng ngự."; skill_lvmax = "Tăng 16% phòng ngự." }
    "禁呪" = @{ id = "camchu"; name = "Cấm Chú"; intro = "Cổ văn phong ấn cấm thuật uy lực nguy hiểm chớ nên khơi mở."; skill_lv1 = "Tăng 8% phòng ngự."; skill_lvmax = "Tăng 16% phòng ngự." }
    "宵祝" = @{ id = "tieuchuc"; name = "Tiêu Chúc"; intro = "Lời chúc phúc thành kính được nguyện cầu trong đêm trăng rằm."; skill_lv1 = "Tăng 8% sinh mệnh."; skill_lvmax = "Tăng 16% sinh mệnh." }
    "残局" = @{ id = "tancuoc"; name = "Tàn Cuộc"; intro = "Bàn cờ thế dang dở thử thách trí tuệ người giải trận."; skill_lv1 = "Tăng 6% tấn công."; skill_lvmax = "Tăng 12% tấn công." }
    "分道扬镳" = @{ id = "duongainaydi"; name = "Đường Ai Nấy Đi"; intro = "Ngã rẽ cuộc đời chia đôi lối đi, mỗi người một chí hướng."; skill_lv1 = "Tăng 8% phòng ngự."; skill_lvmax = "Tăng 16% phòng ngự." }
    "屋嘟娃娃" = @{ id = "bupbeocdo"; name = "Búp Bê Ốc Đô"; intro = "Búp bê vải ngộ nghĩnh mang lại nụ cười cho trẻ thơ thôn dã."; skill_lv1 = "Tăng 8% phòng ngự."; skill_lvmax = "Tăng 16% phòng ngự." }
    "森境之灵" = @{ id = "linhhoncanhrung"; name = "Linh Hồn Cảnh Rừng"; intro = "Tinh linh trú ngụ sâu trong rừng thẳm, bảo hộ cây cỏ muông thú."; skill_lv1 = "Tăng 8% sinh mệnh."; skill_lvmax = "Tăng 16% sinh mệnh." }
    "水境之灵" = @{ id = "linhhoncanhnuoc"; name = "Linh Hồn Cảnh Nước"; intro = "Hồn thiêng của dòng suối nguồn trong vắt, mang lại sự mát lành."; skill_lv1 = "Tăng 6% tấn công."; skill_lvmax = "Tăng 12% tấn công." }
    "苍鹰图腾" = @{ id = "vattochimung"; name = "Vật Tổ Chim Ưng"; intro = "Biểu tượng chim ưng kiêu hãnh của bộ tộc thảo nguyên dũng mãnh."; skill_lv1 = "Tăng 8% phòng ngự."; skill_lvmax = "Tăng 16% phòng ngự." }
    "狼魂图腾" = @{ id = "vattosoihon"; name = "Vật Tổ Sói Hồn"; intro = "Linh vật dã sói đại diện cho lòng quả cảm và tính kỷ luật bầy đàn."; skill_lv1 = "Tăng 8% phòng ngự."; skill_lvmax = "Tăng 16% phòng ngự." }
    "夜鸮图腾" = @{ id = "vattocudem"; name = "Vật Tổ Cú Đêm"; intro = "Vật tổ cú đêm tượng trưng cho sự thông thái và tầm nhìn thấu suốt trong đêm."; skill_lv1 = "Tăng 8% sinh mệnh."; skill_lvmax = "Tăng 16% sinh mệnh." }
    "岚境之灵" = @{ id = "linhhoncanhlam"; name = "Linh Hồn Cảnh Lam"; intro = "Làn gió núi thanh tao mang theo linh khí của mây trời phiêu bồng."; skill_lv1 = "Tăng 6% tấn công."; skill_lvmax = "Tăng 12% tấn công." }
    "焰境之灵" = @{ id = "linhhoncanhdiem"; name = "Linh Hồn Cảnh Diễm"; intro = "Hỏa linh rực cháy mang theo sức sống và sự ấm áp vô tận."; skill_lv1 = "Tăng 6% tấn công."; skill_lvmax = "Tăng 12% tấn công." }
}

$lingziDict = [ordered]@{}
$itemsArray = @()
$idx = 0

foreach ($m in $matches) {
    $idx++
    $rarityStr = $m.Groups[2].Value.Trim()
    $classZh = $m.Groups[3].Value.Trim()
    $statZh = $m.Groups[4].Value.Trim()
    $nameZh = $m.Groups[6].Value.Trim()
    
    $rNum = 5
    $rLabel = "Vàng"
    if ($rarityStr -eq "SR") { $rNum = 4; $rLabel = "Tím" }
    elseif ($rarityStr -eq "R") { $rNum = 3; $rLabel = "Lam" }
    
    $cObj = $classMap[$classZh]
    if (-not $cObj) { $cObj = @{ id = "general"; name = "Chung" } }
    
    $sObj = $statMap[$statZh]
    if (-not $sObj) { $sObj = @{ id = "atk"; name = "Tấn Công"; lv1 = "3.58%"; lv100 = "30%" } }
    
    $meta = $itemMeta[$nameZh]
    if (-not $meta) {
        $meta = @{
            id = "lingzi_$idx"
            name = $nameZh
            intro = "Linh tử bí ẩn chứa đựng năng lượng tinh khiết của thế giới Promilia."
            skill_lv1 = "Gia tăng năng lực chiến đấu trong trận hình."
            skill_lvmax = "Gia tăng mạnh mẽ năng lực chiến đấu trong trận hình."
        }
    }
    
    $id = $meta.id
    $nameVi = $meta.name
    
    # Base attributes scaling
    $baseHp = if ($rNum -eq 5) { "430/3600" } elseif ($rNum -eq 4) { "320/2700" } else { "240/2000" }
    $baseAtk = if ($rNum -eq 5) { "78/650" } elseif ($rNum -eq 4) { "58/490" } else { "44/370" }
    $baseDef = if ($rNum -eq 5) { "18/148" } elseif ($rNum -eq 4) { "14/120" } else { "10/90" }
    $bonusStatVal = "$($sObj.lv1)/$($sObj.lv100)"
    
    # Copy asset image
    $srcImg = "assets\lingzi\item_$idx.png"
    $destImg = "assets\lingzi\$id.png"
    if (Test-Path $srcImg) {
        Copy-Item -Path $srcImg -Destination $destImg -Force
    }
    
    $itemData = [ordered]@{
        id = $id
        name = $nameVi
        original_name = $nameZh
        rarity = $rNum
        rarity_label = $rLabel
        class_id = $cObj.id
        class_name = $cObj.name
        class_zh = $classZh
        stat_id = $sObj.id
        stat_name = $sObj.name
        stat_zh = $statZh
        image = "../../assets/lingzi/$id.png"
        intro = $meta.intro
        intro_zh = $nameZh
        skill = [ordered]@{
            target_role = $cObj.name
            target_role_zh = $classZh
            desc_lv1 = $meta.skill_lv1
            desc_lvmax = $meta.skill_lvmax
        }
        attrs = @(
            [ordered]@{ name = "Sinh Mệnh Cơ Bản"; value = $baseHp }
            [ordered]@{ name = "Tấn Công Cơ Bản"; value = $baseAtk }
            [ordered]@{ name = "Phòng Ngự Cơ Bản"; value = $baseDef }
            [ordered]@{ name = $sObj.name; value = $bonusStatVal }
        )
        acquisition_sources = @(
            "Cầu Nguyện Linh Tử",
            "Thám Hiểm Thế Giới Promilia"
        )
        acquisition_sources_zh = @(
            "灵子祈愿",
            "世界探索"
        )
    }
    
    $lingziDict[$id] = $itemData
    $itemsArray += $itemData
}

Write-Host "Mapped $($itemsArray.Count) items successfully."

# Save datas/lingzi/lingzi.json
$jsonContent = $lingziDict | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText("datas/lingzi/lingzi.json", $jsonContent, [System.Text.Encoding]::UTF8)
Write-Host "datas/lingzi/lingzi.json written."

# Update datas/bundle.js
Write-Host "Updating datas/bundle.js..."
$bundleContent = [System.IO.File]::ReadAllText("datas/bundle.js", [System.Text.Encoding]::UTF8)
$lingziJsChunk = "`n  lingzi: " + ($lingziDict | ConvertTo-Json -Depth 6) + ","
if ($bundleContent -notmatch "lingzi:") {
    $bundleContent = $bundleContent -replace "window\.AZUR_DATA = \{", "window.AZUR_DATA = {$lingziJsChunk"
    [System.IO.File]::WriteAllText("datas/bundle.js", $bundleContent, [System.Text.Encoding]::UTF8)
    Write-Host "datas/bundle.js updated with lingzi dataset."
}

# -------------------------------------------------------------------
# Helper: Render Stars for cards
# -------------------------------------------------------------------
function Get-CardStarsHtml($count, $rel) {
    if (-not $count -or $count -le 0) { return "" }
    $stars = ""
    for ($i = 0; $i -lt $count; $i++) {
        $stars += "<img src=`"${rel}assets/star.png`" class=`"bwiki-star-unit`" alt=`"★`">"
    }
    return "<div class=`"bwiki-card-stars`">$stars</div>"
}

# -------------------------------------------------------------------
# 2. GENERATE pages/lingzi.html
# -------------------------------------------------------------------
Write-Host "Generating pages/lingzi.html..."

$cardsHtml = ""
foreach ($item in $itemsArray) {
    $rClass = "r$($item.rarity)"
    $searchKey = "$($item.name) $($item.original_name) $($item.class_name) $($item.stat_name)".ToLower()
    $stars = Get-CardStarsHtml $item.rarity "../"
    
    $cardsHtml += @"
      <a href="lingzi/$($item.id).html" class="bwiki-item-card $rClass" data-category="$($item.class_id)" data-rarity="$($item.rarity)" data-stat="$($item.stat_id)" data-name="$searchKey">
        <div class="bwiki-item-visual">
          <img src="../assets/lingzi/$($item.id).png" class="bwiki-item-img" alt="$($item.name)" loading="lazy">
          $stars
        </div>
        <div class="bwiki-item-name-box">
          <span class="bwiki-item-name-text">$($item.name)</span>
        </div>
      </a>
"@
}

$lingziListHtml = @"
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Danh Sách Linh Tử - Azur Promilia Wiki</title>
  <link rel="stylesheet" href="../style.css">
  <script src="../templates/layout.js" defer></script>
</head>
<body data-active-tab="lingzi" data-depth="1">
  
  <div class="cosmic-stars"></div>

  <!-- Top Navigation Bar: Injected from master template templates/layout.js -->
  <header id="site-navbar" class="navbar"></header>

  <main class="container">
    <div class="page-header">
      <h1 class="page-title">Danh Sách Linh Tử</h1>
    </div>

    <!-- Search Input: Zero Placeholder per AGENTS.md -->
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input type="text" id="lingzi-search" class="search-input" aria-label="Tìm kiếm linh tử">
    </div>

    <!-- Filter Matrix Table (BWIKI Standard) -->
    <table class="bwiki-filter-table">
      <tbody>
        <tr>
          <th>Tất cả</th>
          <td>
            <button class="filter-pill active" id="btn-reset-filters">Xem tất cả</button>
          </td>
        </tr>
        <tr>
          <th>Độ hiếm</th>
          <td>
            <div class="bwiki-filter-options" id="rarity-filters">
              <button class="filter-pill active" data-rarity="all">Tất cả</button>
              <button class="filter-pill" data-rarity="5">Vàng</button>
              <button class="filter-pill" data-rarity="4">Tím</button>
              <button class="filter-pill" data-rarity="3">Lam</button>
            </div>
          </td>
        </tr>
        <tr>
          <th>Phân loại</th>
          <td>
            <div class="bwiki-filter-options" id="category-filters">
              <button class="filter-pill active" data-category="all">Tất cả</button>
              <button class="filter-pill" data-category="burst">Bạo Phát</button>
              <button class="filter-pill" data-category="destruction">Phá Hoại</button>
              <button class="filter-pill" data-category="assault">Mãnh Công</button>
              <button class="filter-pill" data-category="amplification">Tăng Phúc</button>
              <button class="filter-pill" data-category="bestow">Phó Dữ</button>
              <button class="filter-pill" data-category="general">Chung</button>
            </div>
          </td>
        </tr>
        <tr>
          <th>Thuộc tính</th>
          <td>
            <div class="bwiki-filter-options" id="stat-filters">
              <button class="filter-pill active" data-stat="all">Tất cả</button>
              <button class="filter-pill" data-stat="atk">Tấn Công</button>
              <button class="filter-pill" data-stat="def">Phòng Ngự</button>
              <button class="filter-pill" data-stat="hp">Sinh Mệnh</button>
              <button class="filter-pill" data-stat="crit_rate">Tỉ Lệ Bạo Kích</button>
              <button class="filter-pill" data-stat="crit_dmg">Sát Thương Bạo Kích</button>
              <button class="filter-pill" data-stat="toughness_break">Trị Phá Nhẫn</button>
              <button class="filter-pill" data-stat="overlimit_intensity">Cường Độ Siêu Hạn</button>
              <button class="filter-pill" data-stat="overlimit_crit">Hội Tâm Siêu Hạn</button>
              <button class="filter-pill" data-stat="healing_bonus">Tăng Trị Liệu</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- BWIKI Framed Items Grid -->
    <div id="lingzi-grid" class="bwiki-items-grid">
$cardsHtml
    </div>

    <!-- Empty State -->
    <div id="empty-state" class="empty-state" style="display: none; text-align: center; padding: 60px 0;">
      <p style="color: var(--text-dim); font-size: 1.1rem;">Không tìm thấy linh tử phù hợp.</p>
    </div>
  </main>

  <!-- Footer: Injected from master template templates/layout.js -->
  <footer id="site-footer" class="footer"></footer>

  <script>
    if (window.location.protocol !== 'file:') {
      const clean = window.location.pathname.replace(/\.html$/, '').replace(/\/index$/, '');
      if (clean !== window.location.pathname) {
        window.history.replaceState(null, '', clean + window.location.search + window.location.hash);
      }
    }

    (function() {
      const searchInput = document.getElementById('lingzi-search');
      const resetBtn = document.getElementById('btn-reset-filters');
      const catBtns = document.querySelectorAll('#category-filters .filter-pill');
      const rarityBtns = document.querySelectorAll('#rarity-filters .filter-pill');
      const statBtns = document.querySelectorAll('#stat-filters .filter-pill');
      const cards = document.querySelectorAll('#lingzi-grid .bwiki-item-card');
      const emptyState = document.getElementById('empty-state');

      let currentCategory = 'all';
      let currentRarity = 'all';
      let currentStat = 'all';
      let currentSearch = '';

      function applyFilters() {
        let visibleCount = 0;
        cards.forEach(card => {
          const cardCat = card.dataset.category;
          const cardRarity = card.dataset.rarity;
          const cardStat = card.dataset.stat;
          const cardName = card.dataset.name;

          const matchCat = currentCategory === 'all' || cardCat === currentCategory;
          const matchRarity = currentRarity === 'all' || cardRarity === currentRarity;
          const matchStat = currentStat === 'all' || cardStat === currentStat;
          const matchSearch = !currentSearch || cardName.includes(currentSearch);

          if (matchCat && matchRarity && matchStat && matchSearch) {
            card.style.display = 'inline-flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (emptyState) {
          emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      }

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          currentSearch = e.target.value.trim().toLowerCase();
          applyFilters();
        });
      }

      catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          catBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentCategory = btn.dataset.category;
          applyFilters();
        });
      });

      rarityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          rarityBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentRarity = btn.dataset.rarity;
          applyFilters();
        });
      });

      statBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          statBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentStat = btn.dataset.stat;
          applyFilters();
        });
      });

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'all';
          currentRarity = 'all';
          currentStat = 'all';
          currentSearch = '';
          if (searchInput) searchInput.value = '';
          catBtns.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
          rarityBtns.forEach(b => b.classList.toggle('active', b.dataset.rarity === 'all'));
          statBtns.forEach(b => b.classList.toggle('active', b.dataset.stat === 'all'));
          applyFilters();
        });
      }
    })();
  </script>
</body>
</html>
"@

[System.IO.File]::WriteAllText("pages/lingzi.html", $lingziListHtml, [System.Text.Encoding]::UTF8)
Write-Host "pages/lingzi.html generated successfully."

# -------------------------------------------------------------------
# 3. GENERATE templates/lingzi-template.js
# -------------------------------------------------------------------
Write-Host "Generating templates/lingzi-template.js..."

$templateJs = @'
/**
 * MASTER TEMPLATE: Lingzi Detail Page
 * Azur Promilia Wiki
 * 
 * Provides unified rendering for Lingzi overview, exclusive skill, base attributes, and sources.
 * Strictly adheres to AGENTS.md:
 * - Only color for rarity (no parentheses, no star suffix)
 * - Zero clutter: NO identifier (mã định danh)
 * - Border-radius only on interactive buttons
 * - Seamless background integration
 */
(function() {
  const RARITY_MAP = {
    5: { name: 'Vàng', cls: 'rarity-val-gold' },
    4: { name: 'Tím', cls: 'rarity-val-purple' },
    3: { name: 'Lam', cls: 'rarity-val-blue' }
  };

  function getLingziRarityInfo(rNum) {
    return RARITY_MAP[rNum] || RARITY_MAP[3];
  }

  function getRelPrefix(depth) {
    if (depth === 0) return '';
    if (depth === 1) return '../';
    if (depth === 2) return '../../';
    let rel = '';
    for (let i = 0; i < depth; i++) rel += '../';
    return rel;
  }

  function getPagesRel(depth) {
    if (depth === 0) return 'pages/';
    if (depth === 1) return '';
    if (depth === 2) return '../';
    let rel = '';
    for (let i = 1; i < depth; i++) rel += '../';
    return rel;
  }

  function renderLingziDetail(lz, depth) {
    const rel = getRelPrefix(depth);
    const pagesRel = getPagesRel(depth);
    const rNum = Number(lz.rarity) || 5;
    const rarityInfo = getLingziRarityInfo(rNum);
    const className = lz.class_name || 'Chung';
    const statName = lz.stat_name || 'Tấn Công';
    const introText = lz.intro || 'Linh tử bí ẩn chứa đựng năng lượng tinh khiết của thế giới Promilia.';
    const skill = lz.skill || {};
    const attrs = lz.attrs || [];
    const sources = lz.acquisition_sources || [];

    const sourceBadgesHtml = sources.map(s => `
      <div class="source-badge">
        <span>✦</span>
        <span>${s}</span>
      </div>
    `).join('');

    const attrsRowsHtml = attrs.map(a => `
      <div class="screen-meta-box">
        <div class="meta-k">${a.name}</div>
        <div class="meta-v" style="color:var(--accent-azure);">${a.value}</div>
      </div>
    `).join('');

    return `
    <div class="fremm-layout">
      
      <!-- LEFT RAIL: Integrated Breadcrumb Stack + Dynamic Vertical Gauge -->
      <aside class="fremm-sidebar" id="fremm-sidebar">
        <div class="fremm-breadcrumb-stack">
          <a href="${pagesRel}homepage.html" class="fremm-bc-item fremm-bc-l1">TRANG CHỦ</a>
          <a href="${pagesRel}lingzi.html" class="fremm-bc-item fremm-bc-l2">LINH TỬ</a>
          <div class="fremm-bc-item fremm-bc-l3">${lz.name}</div>
        </div>

        <div class="fremm-gauge-container" id="fremm-gauge-container">
          <div class="fremm-gauge-ruler" id="fremm-gauge-ruler" aria-hidden="true">
            ${Array.from({length: 15}, (_, i) => `<div class="fremm-ruler-tick" data-tick="${i}" style="top: calc(${i} * var(--gauge-tick-spacing, 28px)); opacity: ${[5, 9, 12, 14].includes(i) ? '0' : '1'};"></div>`).join('')}
          </div>
          <nav class="fremm-gauge-track" id="fremm-gauge-track">
            <a href="#screen-lz-overview" class="fremm-gauge-item is-active" data-index="0" data-target="screen-lz-overview" style="top: calc(5 * var(--gauge-tick-spacing, 28px));">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">TỔNG QUAN LINH TỬ</span>
            </a>
            <a href="#screen-lz-skill" class="fremm-gauge-item is-future" data-index="1" data-target="screen-lz-skill" style="top: calc(9 * var(--gauge-tick-spacing, 28px));">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">KỸ NĂNG CHUYÊN DỤNG</span>
            </a>
            <a href="#screen-lz-attrs" class="fremm-gauge-item is-future" data-index="2" data-target="screen-lz-attrs" style="top: calc(12 * var(--gauge-tick-spacing, 28px));">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">THUỘC TÍNH CƠ BẢN</span>
            </a>
            <a href="#screen-lz-sources" class="fremm-gauge-item is-future" data-index="3" data-target="screen-lz-sources" style="top: calc(14 * var(--gauge-tick-spacing, 28px));">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">NGUỒN GỐC THU THẬP</span>
            </a>
          </nav>
        </div>
      </aside>

      <!-- RIGHT COLUMN: INDEPENDENT SCREEN SECTIONS -->
      <div class="fremm-content">
        
        <!-- SCREEN 1: TỔNG QUAN LINH TỬ -->
        <section id="screen-lz-overview" class="detail-screen" data-step="1">
          <div class="screen-header">
            <h2>Tổng Quan Linh Tử</h2>
          </div>

          <div class="screen-overview-layout">
            <div class="screen-visual-frame r${rNum}-frame">
              <img class="screen-visual-icon" src="${rel}assets/lingzi/${lz.id}.png" alt="${lz.name}">
              <div class="screen-stars-row" title="${rNum} sao">
                ${Array.from({ length: rNum }, () => `<img src="${rel}assets/star.png" class="screen-star-unit" alt="★">`).join('')}
              </div>
            </div>

            <div class="screen-overview-info">
              <h1>${lz.name}</h1>
              <div class="screen-overview-original-name">${lz.original_name || ''}</div>

              <!-- Zero-Clutter Meta Grid: Strictly Only Color, NO Identifier -->
              <div class="screen-meta-grid">
                <div class="screen-meta-box">
                  <div class="meta-k">Phân loại</div>
                  <div class="meta-v">${className}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Độ hiếm</div>
                  <div class="meta-v ${rarityInfo.cls}">${rarityInfo.name}</div>
                </div>
                <div class="screen-meta-box" style="grid-column: span 2;">
                  <div class="meta-k">Thuộc tính chính</div>
                  <div class="meta-v" style="color:var(--accent-azure);">${statName}</div>
                </div>
              </div>

              <div class="screen-lore-card">
                <div>${introText}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- SCREEN 2: KỸ NĂNG CHUYÊN DỤNG -->
        <section id="screen-lz-skill" class="detail-screen" data-step="2">
          <div class="screen-header">
            <h2>Kỹ Năng Chuyên Dụng</h2>
          </div>

          <div class="screen-section-block">
            <div style="margin-bottom: 16px; font-weight: 700; color: var(--text-dim);">
              Áp dụng hiệu quả cho nhân vật: <span style="color: var(--accent-azure);">${skill.target_role || className}</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div class="screen-lore-card" style="margin: 0;">
                <div style="font-weight: 800; color: #0f172a; margin-bottom: 6px;">Khởi đầu (Lv.1)</div>
                <div>${skill.desc_lv1 || 'Gia tăng năng lực chiến đấu trong trận hình.'}</div>
              </div>

              <div class="screen-lore-card" style="margin: 0; border-left: 3px solid #0284c7;">
                <div style="font-weight: 800; color: #0f172a; margin-bottom: 6px;">Toàn mãn (Lv.100 / Mãn sao)</div>
                <div>${skill.desc_lvmax || 'Gia tăng mạnh mẽ năng lực chiến đấu trong trận hình.'}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- SCREEN 3: THUỘC TÍNH CƠ BẢN -->
        <section id="screen-lz-attrs" class="detail-screen" data-step="3">
          <div class="screen-header">
            <h2>Thuộc Tính Cơ Bản</h2>
          </div>

          <div class="screen-section-block">
            <div style="margin-bottom: 14px; font-size: 0.88rem; color: var(--text-dim); font-weight: 600;">
              Giá trị hiển thị theo định dạng: Khởi điểm Lv.1 / Tối đa Lv.100
            </div>
            <div class="screen-meta-grid" style="margin-bottom: 0;">
              ${attrsRowsHtml}
            </div>
          </div>
        </section>

        <!-- SCREEN 4: NGUỒN GỐC THU THẬP -->
        <section id="screen-lz-sources" class="detail-screen" data-step="4">
          <div class="screen-header">
            <h2>Nguồn Gốc Thu Thập</h2>
          </div>

          <div class="screen-sources-list">
            ${sourceBadgesHtml || '<div class="empty-state">Chưa có thông tin nguồn gốc.</div>'}
          </div>
        </section>

      </div>
    </div>`;
  }

  function initGaugeScroll() {
    const screens = document.querySelectorAll('.detail-screen');
    const gaugeItems = document.querySelectorAll('.fremm-gauge-item');
    if (!screens.length || !gaugeItems.length) return;

    function onScroll() {
      const scrollPos = window.scrollY + 200;
      let activeIndex = 0;

      screens.forEach((screen, index) => {
        const top = screen.offsetTop;
        const height = screen.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          activeIndex = index;
        }
      });

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        activeIndex = screens.length - 1;
      }

      gaugeItems.forEach((item, index) => {
        if (index === activeIndex) {
          item.className = 'fremm-gauge-item is-active';
        } else if (index < activeIndex) {
          item.className = 'fremm-gauge-item is-past';
        } else {
          item.className = 'fremm-gauge-item is-future';
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    gaugeItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const offsetTop = targetEl.offsetTop - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      });
    });
  }

  function initLingziDetail() {
    const rootEl = document.getElementById('lingzi-detail-root');
    if (!rootEl) return;

    const depth = (document.body && document.body.dataset.depth !== undefined) 
      ? parseInt(document.body.dataset.depth, 10) 
      : 2;

    const lzData = window.__ITEM_DATA__;
    if (!lzData) {
      rootEl.innerHTML = '<div class="container empty-state" style="padding:60px 0; text-align:center;">Dữ liệu linh tử không tồn tại.</div>';
      return;
    }

    rootEl.innerHTML = renderLingziDetail(lzData, depth);
    initGaugeScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLingziDetail);
  } else {
    initLingziDetail();
  }

  window.LingziTemplate = {
    renderLingziDetail,
    initLingziDetail
  };
})();
'@

[System.IO.File]::WriteAllText("templates/lingzi-template.js", $templateJs, [System.Text.Encoding]::UTF8)
Write-Host "templates/lingzi-template.js generated successfully."

# -------------------------------------------------------------------
# 4. GENERATE all pages/lingzi/[id].html
# -------------------------------------------------------------------
Write-Host "Generating individual pages/lingzi/*.html..."

$cleanUrlScript = @"
<script>
  if (window.location.protocol !== 'file:') {
    const clean = window.location.pathname.replace(/\.html$/, '').replace(/\/index$/, '');
    if (clean !== window.location.pathname) {
      window.history.replaceState(null, '', clean + window.location.search + window.location.hash);
    }
  }
</script>
"@

$countPages = 0
foreach ($item in $itemsArray) {
    $countPages++
    $id = $item.id
    $itemJson = $item | ConvertTo-Json -Depth 6 -Compress

    $pageHtml = @"
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$($item.name) - Azur Promilia Wiki</title>
  <link rel="stylesheet" href="../../style.css">
  <script>window.__ITEM_DATA__ = $itemJson;</script>
  <script src="../../templates/layout.js" defer></script>
  <script src="../../templates/lingzi-template.js" defer></script>
</head>
<body data-page="lingzi-detail" data-item-id="$id" data-depth="2" data-active-tab="lingzi">
  
  <div class="cosmic-stars"></div>

  <!-- Top Navigation Bar: Injected from master template templates/layout.js -->
  <header id="site-navbar" class="navbar"></header>

  <!-- Main Content: Injected from master template templates/lingzi-template.js -->
  <main id="lingzi-detail-root" class="container detail-container"></main>

  <!-- Footer: Injected from master template templates/layout.js -->
  <footer id="site-footer" class="footer"></footer>

  $cleanUrlScript
</body>
</html>
"@

    $outPath = "pages/lingzi/$id.html"
    [System.IO.File]::WriteAllText($outPath, $pageHtml, [System.Text.Encoding]::UTF8)
}

Write-Host "Generated $countPages detail pages in pages/lingzi/."
Write-Host "All tasks completed successfully!"
