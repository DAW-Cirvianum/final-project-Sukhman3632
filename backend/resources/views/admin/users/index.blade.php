<!DOCTYPE html>
<html>
<head>
    <title>Users</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); min-height: 100vh; }
        .navbar { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important; margin-bottom: 2rem; }
        .table-container { background: white; border-radius: 10px; padding: 2rem; }
        .btn-primary { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border: none; }
        .btn-logout { background: white; color: #4facfe; border: none; font-weight: 600; }
        .btn-logout:hover { background: rgba(255,255,255,0.9); color: #4facfe; }
    </style>
</head>
<body>
    <nav class="navbar navbar-dark">
        <div class="container-fluid">
            <span class="navbar-brand"><i class="bi bi-speedometer2"></i> Admin Panel</span>
            <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button class="btn btn-logout" type="submit"><i class="bi bi-box-arrow-right"></i> Logout</button>
            </form>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="table-container">
            <h1><i class="bi bi-people"></i> Users</h1>
        
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <div class="table-responsive">
            <table class="table table-striped">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($users as $user)
                    <tr>
                        <td>{{ $user->id }}</td>
                        <td>{{ $user->name }}</td>
                        <td>{{ $user->email }}</td>
                        <td><span class="badge bg-secondary">{{ $user->role ?? 'N/A' }}</span></td>
                        <td><span class="badge {{ $user->active ? 'bg-success' : 'bg-danger' }}">{{ $user->active ? 'Yes' : 'No' }}</span></td>
                        <td>
                            <a href="{{ route('admin.users.edit', $user->id) }}" class="btn btn-sm btn-primary"><i class="bi bi-pencil"></i> Edit</a>
                            <form action="{{ route('admin.users.toggle', $user->id) }}" method="POST" class="d-inline">
                                @csrf
                                @method('PATCH')
                                <button type="submit" class="btn btn-sm btn-warning"><i class="bi bi-toggle-on"></i> Toggle</button>
                            </form>
                            <form action="{{ route('admin.users.destroy', $user->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Delete user?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-danger"><i class="bi bi-trash"></i> Delete</button>
                            </form>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="d-flex justify-content-center">
            {{ $users->links() }}
        </div>
        </div>
    </div>
</body>
</html>
