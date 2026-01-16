<!DOCTYPE html>
<html>
<head>
    <title>Admin Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { 
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            min-height: 100vh; 
            display: flex; 
            align-items: center; 
        }
        .login-card { 
            max-width: 420px;
            border-radius: 15px;
            overflow: hidden;
        }
        .card-header {
            padding: 2rem;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        .card-body {
            padding: 2.5rem;
        }
        .input-group-text {
            background-color: #f8f9fa;
            border-right: none;
        }
        .form-control {
            border-left: none;
        }
        .form-control:focus {
            box-shadow: 0 0 0 0.25rem rgba(79, 172, 254, 0.25);
        }
        .btn-primary {
            padding: 0.75rem;
            font-weight: 600;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            border: none;
            transition: all 0.3s;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(79, 172, 254, 0.4);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow login-card mx-auto">
                    <div class="card-header bg-primary text-white text-center">
                        <h4><i class="bi bi-shield-lock"></i> Admin Login</h4>
                    </div>
                    <div class="card-body p-4">
                        @if(session('error'))
                            <div class="alert alert-danger">
                                <i class="bi bi-exclamation-circle"></i> {{ session('error') }}
                            </div>
                        @endif

                        <form action="{{ route('admin.login.submit') }}" method="POST">
                            @csrf
                            <div class="mb-3">
                                <label class="form-label">Email or Username</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-person"></i></span>
                                    <input type="text" name="login" class="form-control" required autofocus>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-lock"></i></span>
                                    <input type="password" name="password" class="form-control" required>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">
                                <i class="bi bi-box-arrow-in-right"></i> Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
