(function ($) {
  $(function () {
    function updateHeaderSize() {
      const h = $("#global-head").outerHeight();
      document.documentElement.style.setProperty("--header-h", h + "px");
    }
    updateHeaderSize();
    $(window).on("resize", updateHeaderSize);
    $(".sub-menu.is-active .sub-menu-nav").show();
    $(".sub-menu-head").on("click", function () {
      var $subNav = $(this).next(".sub-menu-nav");
      if ($subNav.is(":visible")) {
        $subNav.velocity("slideUp", { duration: 200 });
        $(this).parent("li").removeClass("is-active");
      } else {
        $subNav.velocity("slideDown", { duration: 200 });
        $(this).parent("li").addClass("is-active");
      }
      return false;
    });
    $("#nav-toggle").on("click", function () {
      $("body").toggleClass("close");
    });
    $("#popupBtn").on("click", function () {
      $("#myPopup").fadeIn().addClass("show");
    });
    $("#myPopup").on("click", function (e) {
      if (e.target === this) {
        $(this).fadeOut().removeClass("show");
      }
    });
    $("#close").on("click", function () {
      $("#myPopup").fadeOut().removeClass("show");
    });
    $("#openVpnUserPopup").on("click", function () {
      $("#vpnUserPopup").fadeIn().addClass("show");
    });
    $("#closeVpnUserPopup").on("click", function () {
      $("#vpnUserPopup").fadeOut().removeClass("show");
    });
  });
})(jQuery);
$(document).ready(function () {
  let vpnEnabledApplied = false;
  let pskApplied = false;
  function updateVpnUiState() {
    const vpnEnabled = vpnEnabledApplied;
    $("#openVpnUserPopup").prop("disabled", !(vpnEnabled && pskApplied));
    $(".delete-btn").prop("disabled", !vpnEnabled);
    $("#openVpnUserPopup").css("opacity", vpnEnabled && pskApplied ? 1 : 0.5);
    $(".delete-btn").css("opacity", vpnEnabled ? 1 : 0.5);
  }
  $("#vpnEnable").on("change", function () {
    updateVpnUiState();
  });
  $("#applyPsk").on("click", function () {
    const psk = $("#vpnPsk").val();
    const uiChecked = $("#vpnEnable").is(":checked");
    $("#vpnPskErrorMsg").text("​");
    if (!psk) {
      pskApplied = false;
      $("#vpnPskErrorMsg").text("事前共有キーを入力してください。");
      updateVpnUiState();
      return;
    }
    if (!/^[\x20-\x7E]+$/.test(psk)) {
      pskApplied = false;
      $("#vpnPskErrorMsg").text("全角文字は使用できません。");
      updateVpnUiState();
      return;
    }
    if (/\x20/.test(psk)) {
      pskApplied = false;
      $("#vpnPskErrorMsg").text("スペースは使用できません。");
      updateVpnUiState();
      return;
    }
    vpnEnabledApplied = uiChecked;
    pskApplied = true;
    updateVpnUiState();
  });
  $(document).on("click", ".delete-btn", function () {
    if ($(this).prop("disabled")) return;
    $(this).closest("tr").remove();
  });
  $(document).on("click", "#addVpnUser", function () {
    if ($(this).prop("disabled")) return;
    const user = $("#vpnUser").val().trim();
    const pass = $("#vpnPass").val().trim();
    if (!user || !pass) {
      $("#vpnErrorMsg").text("ユーザー名とパスワードを入力してください");
      return;
    }
    if (!/^[\x20-\x7E]+$/.test(user) || !/^[\x20-\x7E]+$/.test(pass)) {
      $("#vpnErrorMsg").text("全角文字は使用できません。");
      return;
    } else if (/\x20/.test(user) || /\x20/.test(pass)) {
      $("#vpnErrorMsg").text("スペースは使用できません。");
      return;
    }
    const isDuplicate = $("#vpnUserTable tbody tr")
      .not("#vpnInputRow")
      .toArray()
      .some(
        (row) =>
          $(row).find("td").eq(0).text().toLowerCase() === user.toLowerCase(),
      );
    if (isDuplicate) {
      $("#vpnErrorMsg").text("同じユーザー名が既に存在します");
      return;
    }
    $("#vpnErrorMsg").text("​");
    const newRow = `\n            <tr>\n                <td>${user}</td>\n                <td>******</td>\n                <td>\n                    <button class="table delete-btn">削除</button>\n                </td>\n            </tr>\n        `;
    $("#vpnUserTable tbody").append(newRow);
    $("#vpnUser").val("");
    $("#vpnPass").val("");
    updateVpnUiState();
    $("#FinishPopup").fadeIn().addClass("show");
    $("#vpnUserPopup").fadeOut().removeClass("show");
  });
  $(document).on("click", "#cancelVpnUser", function () {
    $("#vpnUser").val("");
    $("#vpnPass").val("");
    $("#vpnErrorMsg").text("");
    $("#vpnUserPopup").fadeOut().removeClass("show");
  });
  updateVpnUiState();
  let enableGiveupPopup = true;
  if ($("#FinishPopup").hasClass("show")) {
    enableGiveupPopup = false;
  }
  let giveupClosable = false;
  function startGiveupPopupTimer() {
    const startTime = Date.now();
    function checkElapsed() {
      const elapsed = Date.now() - startTime;
      if (elapsed >= 10 * 60 * 1e3) {
        if (!enableGiveupPopup) return;
        $("#GiveupPopup").fadeIn().addClass("show");
        giveupClosable = false;
        setTimeout(function () {
          giveupClosable = true;
        }, 3 * 1e3);
        $("#dummyBtn").addClass("giveup-btn").attr("title", "結果を再表示");
      } else {
        setTimeout(checkElapsed, 1e3);
      }
    }
    checkElapsed();
  }
  function showGiveupPopupReplay() {
    $("#GiveupPopup").fadeIn().addClass("show");
    giveupClosable = true;
  }
  $("#GiveupPopup").on("click", function (e) {
    if (e.target === this && giveupClosable) {
      $(this).fadeOut().removeClass("show");
    }
  });
  $(document).on("click", ".giveup-btn", function () {
    showGiveupPopupReplay();
  });
  startGiveupPopupTimer();
});
