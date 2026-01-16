<!DOCTYPE html>
<html>
<head>
    <title>Edit User</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); min-height: 100vh; }
        .navbar { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important; }
        .card { border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); border: none; }
        .card-header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border-radius: 10px 10px 0 0 !important; }
        .btn-primary { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border: none; }
    </style>
</head>
<body>
    <nav class="navbar navbar-dark">
        <div class="container-fluid">
            <span class="navbar-brand"><i class="bi bi-speedometer2"></i> Admin Panel</span>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0"><i class="bi bi-person-gear"></i> Edit User #{{ $user->id }}</h4>
                    </div>
                    <div class="card-body">
                        <form action="{{ route('admin.users.update', $user->id) }}" method="POST">
                            @csrf
                            @method('PUT')
                            
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" name="name" class="form-control" value="{{ old('name', $user->name) }}" required>
                                @error('name')<div class="text-danger">{{ $message }}</div>@enderror
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Username</label>
                                <input type="text" name="username" class="form-control" value="{{ old('username', $user->username) }}" required>
                                @error('username')<div class="text-danger">{{ $message }}</div>@enderror
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" name="email" class="form-control" value="{{ old('email', $user->email) }}" required>
                                @error('email')<div class="text-danger">{{ $message }}</div>@enderror
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Password (leave blank to keep current)</label>
                                <input type="password" name="password" class="form-control">
                                @error('password')<div class="text-danger">{{ $message }}</div>@enderror
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Role</label>
                                <select name="role_id" class="form-select" required>
                                    @foreach($roles as $role)
                                        <option value="{{ $role->id }}" {{ $user->role_id == $role->id ? 'selected' : '' }}>
                                            {{ $role->name }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('role_id')<div class="text-danger">{{ $message }}</div>@enderror
                            </div>
                            
                            <div class="mb-3 form-check">
                                <input type="checkbox" name="active" value="1" class="form-check-input" id="active" {{ $user->active ? 'checked' : '' }}>
                                <label class="form-check-label" for="active">Active</label>
                            </div>
                            
                            <button type="submit" class="btn btn-primary"><i class="bi bi-check-circle"></i> Update</button>
                            <a href="{{ route('admin.users.index') }}" class="btn btn-secondary"><i class="bi bi-arrow-left"></i> Cancel</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
