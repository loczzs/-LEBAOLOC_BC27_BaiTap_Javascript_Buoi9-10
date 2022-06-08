// định nghĩa lớp đối tượng
function Staff(
  idEl,
  nameEl,
  emailEl,
  passEl,
  dateEl,
  salaryEl,
  positionEl,
  timeEl
) {
  this.idEl = idEl;
  this.nameEl = nameEl;
  this.emailEl = emailEl;
  this.passEl = passEl;
  this.dateEl = dateEl;
  this.salaryEl = salaryEl;
  this.positionEl = positionEl;
  this.timeEl = timeEl;
}
Staff.prototype.calcSalary = function () {
  if (this.positionEl == "sếp") {
    return this.salaryEl * 3;
  } else if (this.positionEl == "Trưởng phòng") {
    return this.salaryEl * 2;
  } else if (this.positionEl == "Nhân viên") {
    return this.salaryEl;
  } else {
    return "";
  }
};
Staff.prototype.xepLoai = function () {
  if (this.positionEl == "Nhân viên" && this.timeEl >= 192) {
    return "Nhân viên xuất sắc";
  } else if (this.positionEl == "Nhân viên" && this.timeEl >= 176) {
    return "Nhân viên  giỏi";
  } else if (this.positionEl == "Nhân viên" && this.timeEl >= 160) {
    return "Nhân viên khá";
  } else if (this.positionEl == "Nhân viên" && this.timeEl < 160) {
    return "Nhân viên trung bình";
  } else {
    return "";
  }
};

var staffs = [];
init();

// Hàm này sẽ tự động được gọi đầu tiên khi chương trình được chạy
// Hàm này dùng để lấy data từ local storage và gán lại cho mảng students sau đó hiển thị ra giao diện
function init() { 
  // B1: Lấy data từ localStorage
  // Khi lấy data từ localStorage lên, nếu data là array/object (đã bị stringify) thì cần dùng hàm JSON.parse để chuyển data về lại array/object
  staffs = JSON.parse(localStorage.getItem("staffs")) || [];

  // Bởi vì JSON.stringify tự động loại bỏ các phương thức (function) bên trong object => các object student bên trong mảng bị mất hàm calcScore

  for (var i = 0; i < staffs.length; i++) {
    var staffXs = staffs[i];
    staffs[i] = new Staff(
      staffXs.idEl,
      staffXs.nameEl,
      staffXs.emailEl,
      staffXs.passEl,
      staffXs.dateEl,
      staffXs.salaryEl,
      staffXs.positionEl,
      staffXs.timeEl,
    );
  }

  // students = [{id: 1, name: "Dan"}, {id: 2, name: "Hieu"}, {id: 3, name: "Thái"}]
                     // X     
  // Lần 1: i = 0 => students[0] => student = {id: 1, name: "Dan"}
  // students[0] = new Student(...) lấy cái này gán lại cho X vì X đã bị xóa phương thức
  // [{Student}, {}, {}]

  // Lần 2: i = 1 => students[1] => student = {id: 2, name: "Hieu"}
  // students[1] = new Student(...)
  // [{Student}, {Student}, {}]

  // Lần 3: i = 2 => students[2] => student = {id: 3, name: "Thái"}
  // students[2] = new Student(...)

  // Kết quả: [{Student}, {Student}, {Student}]

  // B2: Gọi hàm display để hiển thị ra giao diện
  display(students);
}
// DOM
function addStaff() {
  var idEl = document.getElementById("tknv").value;
  var nameEl = document.getElementById("name").value;
  var emailEl = document.getElementById("email").value;
  var passEl = document.getElementById("password").value;
  var dateEl = document.getElementById("datepicker").value;
  var salaryEl = +document.getElementById("luongCB").value;
  var positionEl = document.getElementById("chucvu").value;
  var timeEl = +document.getElementById("gioLam").value;

  var isValid = validation();

  if (!isValid) {
    alert("vui lòng nhập vào các giá trị");
    return;
  }
  var staffEl = new Staff(
    idEl,
    nameEl,
    emailEl,
    passEl,
    dateEl,
    salaryEl,
    positionEl,
    timeEl
  );
  staffs.push(staffEl);
  localStorage.setItem("staffs", JSON.stringify(staffs));
  display(staffs);
  resetForm()
}
function display(staffs) {
  var tableEl = document.getElementById("tableDanhSach");
  var html = "";
  for (var i = 0; i < staffs.length; i++) {
    var staffEl = staffs[i];
    html += `<tr>
    <td>${staffEl.idEl}</td>
    <td>${staffEl.nameEl}</td>
    <td>${staffEl.emailEl}</td>
    <td>${staffEl.dateEl}</td>
    <td>${staffEl.positionEl}</td>
    <td>${staffEl.calcSalary()}</td>
    <td>${staffEl.xepLoai()}</td>
    <td>
      <button
      data-toggle="modal"
      data-target="#myModal"
       class="btn btn-success"
       onclick = "selectStaff('${staffEl.idEl}')"
      >
      Cập nhật
      </button>
      <button
        class="btn btn-danger"
        onclick="deleteStaff('${staffEl.idEl}')"
      >
        Xoá
      </button>
    </td>
  </tr>`;
  }

  tableEl.innerHTML = html;
}
function searchStaff() {
  var loaiNv = document.getElementById("searchName").value;
  loaiNv.toLowerCase();
  var newStaff = [];
  for (var i = 0; i < staffs.length; i++) {
    var staffEl = staffs[i];
    if (
      staffEl.positionEl == "Nhân viên" &&
      staffEl.xepLoai().toLowerCase().indexOf(loaiNv) !== -1
    ) {
      newStaff.push(staffEl);
    }
  }
  display(newStaff);
  resetForm()
}

function deleteStaff(staffId) {
  console.log(typeof staffId);
  console.log(index);
  var index = findStaff(staffId);
  if (index !== -1) {
    staffs.splice(index, 1);
  }
  localStorage.setItem("staffs", JSON.stringify(staffs));
  display(staffs);
}
function selectStaff(staffId) {
  var index = findStaff(staffId);
  var staffEl = staffs[index];
  document.getElementById("tknv").value = staffEl.idEl;
  document.getElementById("name").value = staffEl.nameEl;
  document.getElementById("email").value = staffEl.emailEl;
  document.getElementById("password").value = staffEl.passEl;
  document.getElementById("datepicker").value = staffEl.dateEl;
  document.getElementById("luongCB").value = staffEl.salaryEl;
  document.getElementById("chucvu").value = staffEl.positionEl;
  document.getElementById("gioLam").value = staffEl.timeEl;

  document.getElementById("tknv").disabled = true;
  document.getElementById("btnThemNV").disabled = true;
  
}
function updateStaff() {
  var idEl = document.getElementById("tknv").value;
  var nameEl = document.getElementById("name").value;
  var emailEl = document.getElementById("email").value;
  var passEl = document.getElementById("password").value;
  var dateEl = document.getElementById("datepicker").value;
  var salaryEl = +document.getElementById("luongCB").value;
  var positionEl = document.getElementById("chucvu").value;
  var timeEl = +document.getElementById("gioLam").value;

  var staffEls = new Staff(
    idEl,
    nameEl,
    emailEl,
    passEl,
    dateEl,
    salaryEl,
    positionEl,
    timeEl
  );
  var index = findStaff(staffEls.idEl);
  staffs[index] = staffEls;
  localStorage.setItem("staffs", JSON.stringify(staffs));
  display(staffs);
  resetForm()
}
function findStaff(staffId) {
  var index = -1;
  for (var i = 0; i < staffs.length; i++) {
    if (staffs[i].idEl === staffId) {
      index = i;
      break;
    }
  }
  return index;
}
function isRequired(value) {
  if (!value) {
    return false;
  }
  return true;
}
function validation() {
  var idEl = document.getElementById("tknv").value;
  var nameEl = document.getElementById("name").value;
  var emailEl = document.getElementById("email").value;
  var passEl = document.getElementById("password").value;
  var dateEl = document.getElementById("datepicker").value;
  var salaryEl = +document.getElementById("luongCB").value;
  var positionEl = document.getElementById("chucvu").value;
  var timeEl = +document.getElementById("gioLam").value;
  var isValid = true;
  if (!isRequired(idEl)) {
    // kiểm tr nếu isREquired là false
    isValid = false;
    document.getElementById("tbTKNV").style.display = "block";
    document.getElementById("tbTKNV").innerHTML =
      "Tên tài khoản không được để trống";
  } else if (!minLenght(idEl, 4, 6)) {
    isValid = false;
    document.getElementById("tbTKNV").style.display = "block";
    document.getElementById("tbTKNV").innerHTML =
      "Tên tài khoản phải có ít nhất 4-6 kí tự";
  } else {
    document.getElementById("tbTKNV").innerHTML = "";
  }
  var letters = new RegExp("^[A-Za-z]+$");
  if (!isRequired(nameEl)) {
    isValid = false;
    document.getElementById("tbTen").style.display = "block";
    document.getElementById("tbTen").innerHTML =
      "Họ và tên không được để trống";
  } else if (!letters.test(nameEl)) {
    isValid = false;
    document.getElementById("tbTen").style.display = "block";
    document.getElementById("tbTen").innerHTML = "Họ và tên không đúng kí tự";
  } else {
    document.getElementById("tbTen").innerHTML = "";
  }
  var emailPattern = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$");
  if (!isRequired(emailEl)) {
    isValid = false;
    document.getElementById("tbEmail").style.display = "block";
    document.getElementById("tbEmail").innerHTML = "email không được để trống";
  } else if (!emailPattern.test(emailEl)) {
    isValid = false;
    document.getElementById("tbEmail").style.display = "block";
    document.getElementById("tbEmail").innerHTML = "email không đúng kí tự";
  } else {
    document.getElementById("tbEmail").innerHTML = "";
  }
  if (!isRequired(passEl)) {
    isValid = false;
    document.getElementById("tbMatKhau").style.display = "block";
    document.getElementById("tbMatKhau").innerHTML =
      "Mật khẩu không được để trống";
  } else if (!minLenght(passEl, 6, 10)) {
    isValid = false;
    document.getElementById("tbMatKhau").style.display = "block";
    document.getElementById("tbMatKhau").innerHTML =
      "Mật khẩu phải có ít nhất 6-10 kí tự";
  } else {
    document.getElementById("tbMatKhau").innerHTML = "";
  }
  if (!isRequired(dateEl)) {
    isValid = false;
    document.getElementById("tbNgay").style.display = "block";
    document.getElementById("tbNgay").innerHTML =
      "Ngày làm không được để trống";
  } else {
    document.getElementById("tbNgay").innerHTML = "";
  }
  if (!isRequired(salaryEl)) {
    isValid = false;
    document.getElementById("tbLuongCB").style.display = "block";
    document.getElementById("tbLuongCB").innerHTML =
      "lương làm không được để trống";
  }else if(1*10**6 > salaryEl || salaryEl > 20*10**6){
    isValid = false;
    document.getElementById("tbLuongCB").style.display = "block";
    document.getElementById("tbLuongCB").innerHTML =
      "nhập sai lương";
  }else{
    document.getElementById("tbLuongCB").innerHTML =""
  }
  if(positionEl == "Chọn chức vụ"){
      isValid = false
      document.getElementById("tbChucVu").style.display = "block";
    document.getElementById("tbChucVu").innerHTML =
      "chọn lại chức vụ";
  }else{
    document.getElementById("tbChucVu").style.display = "block";
    document.getElementById("tbChucVu").innerHTML =
      "";
  }
  if(!isRequired(timeEl)){
      isValid = false
      document.getElementById("tbGiolam").style.display = "block";
    document.getElementById("tbGiolam").innerHTML =
      "thời gian làm không được để trống";
  }else if(80 > timeEl || timeEl > 200){
      isValid = false
      document.getElementById("tbGiolam").style.display = "block";
    document.getElementById("tbGiolam").innerHTML = "Nhập lại thời gian làm"
  }else{
    document.getElementById("tbGiolam").innerHTML =""
  }
  return isValid;
}
function minLenght(value, start, end) {
  if (start > value.length || value.length > end) {
    return false;
  }
  return true;
}
function resetForm(){
     document.getElementById("tknv").value ="";
   document.getElementById("name").value ="";
   document.getElementById("email").value ="";
   document.getElementById("password").value ="";
   document.getElementById("datepicker").value ="";
  document.getElementById("luongCB").value ="";
   document.getElementById("chucvu").value ="";
  document.getElementById("gioLam").value ="";
  document.getElementById("searchName").value =""
  document.getElementById("tknv").disabled = false;
  document.getElementById("btnThemNV").disabled = false;
}
