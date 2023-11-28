angular.module("mainapp",[])
    .controller("maincontroller",function($scope){
        $scope.inputAccount = "";
        $scope.inputPassword = "";
        //登录
        $scope.login = function(){
            if(checkFirst() != false){
                login_ajax($scope.inputAccount,$scope.inputPassword);
            }else{
                alert("请将信息填写完整...");
            };
        };
        function checkFirst(){
            if($scope.inputAccount!=null && $scope.inputAccount!=""
                && $scope.inputPassword!=null && $scope.inputPassword!=""){
                return true;
            }else{
                return false;
            }
        };
        function login_ajax(account,password){
            this.account = account;
            //this.password = hex_md5(password);
            this.password = (password);
            $.ajax({
                type:"GET",
                url:"/user/loginApp",
                data:{"username":this.account,"password":this.password},
                contentType:"application/x-www-form-urlencoded",
                dataType:"json",
                success:function(data){
                    console.log(data);
                    var v = data.value;
                    $scope.$apply(function(){
                        if(data.success == true && data.message == "登录成功"){
                            $scope.inputAccount = "";$scope.inputPassword = "";
                            //alert("登录成功1!");
                            var urlTo = v.role==="admin" ? "/jsp/user/user.jsp" : "/jsp/info/info.jsp";
                            window.location.href = urlTo;
                        }else if(data.success == false && data.message == "密码错误"){
                            $scope.inputAccount = "";$scope.inputPassword = "";
                            alert("密码错误!");
                        }else if(data.success == false && data.message == "用户被封号"){
                            $scope.inputAccount = "";$scope.inputPassword = "";
                            alert("该用户已被封号,请联系管理员!");
                        }else if(data.success == false && data.message == "用户不存在"){
                            $scope.inputAccount = "";$scope.inputPassword = "";
                            alert("该用户不存在！");
                        }
                    });
                }
            });
        }
    });

