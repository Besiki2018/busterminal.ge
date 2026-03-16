<div class="bt-login-view">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
        rel="stylesheet"
    />
    <link rel="stylesheet" href="{{ asset('admin-template/assets/vendor/fonts/iconify-icons.css') }}" />
    <link rel="stylesheet" href="{{ asset('admin-template/assets/vendor/libs/node-waves/node-waves.css') }}" />
    <link rel="stylesheet" href="{{ asset('admin-template/assets/vendor/css/core.css') }}" />
    <link rel="stylesheet" href="{{ asset('admin-template/assets/css/demo.css') }}" />
    <link rel="stylesheet" href="{{ asset('admin-template/assets/vendor/css/pages/page-auth.css') }}" />

    <style>
        .bt-login-view,
        .bt-login-view * {
            font-family: "Public Sans", sans-serif;
        }

        .bt-login-view .app-brand-logo img {
            display: block;
            width: auto;
            height: 2.9rem;
        }

        .bt-login-view .authentication-wrapper {
            min-height: 100vh;
            background:
                radial-gradient(circle at top right, rgba(22, 18, 64, 0.08), transparent 30%),
                linear-gradient(180deg, #f8f7fa 0%, #f4f5fb 100%);
        }

        .bt-login-view .auth-form-card {
            border-radius: 1.5rem;
            background: rgba(255, 255, 255, 0.94);
            box-shadow: 0 1.5rem 3rem rgba(47, 51, 73, 0.12);
            padding: 2rem;
        }

        .bt-login-view .auth-form-card .btn-primary {
            background: linear-gradient(135deg, #7367f0, #696cff);
            border-color: transparent;
            box-shadow: 0 0.5rem 1.25rem rgba(115, 103, 240, 0.28);
        }

        .bt-login-view .auth-login-column {
            min-height: 100vh;
            padding: 1.5rem;
        }

        .bt-login-view .auth-login-inner {
            width: 100%;
            max-width: 420px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 1.25rem;
        }

        .bt-login-view .auth-login-brand {
            align-items: center;
            display: flex;
            justify-content: center;
        }

        .bt-login-view .auth-login-brand .app-brand {
            align-items: center;
            display: inline-flex;
            justify-content: center;
            margin: 0;
            padding: 0;
        }
    </style>

    <div class="authentication-wrapper authentication-cover">
        <div class="authentication-inner row m-0">
            <div class="d-flex col-12 align-items-center justify-content-center authentication-bg auth-login-column">
                <div class="auth-login-inner">
                    <div class="auth-login-brand">
                        <a href="{{ url('/admin') }}" class="app-brand">
                            <span class="app-brand-logo">
                                <img src="{{ asset('brand/logo.png') }}" alt="Buster Terminal" />
                            </span>
                        </a>
                    </div>

                    <div class="auth-form-card">
                        <h4 class="mb-1">კეთილი იყოს შენი დაბრუნება</h4>
                        <p class="mb-6">გაიარე ავტორიზაცია მართვის პანელში შესასვლელად.</p>

                        <form wire:submit="authenticate" class="mb-6">
                            <div class="mb-6">
                                <label for="email" class="form-label">ელ. ფოსტა</label>
                                <input
                                    id="email"
                                    type="email"
                                    wire:model.defer="data.email"
                                    class="form-control @if ($errors->has('data.email')) is-invalid @endif"
                                    placeholder="შეიყვანე ელ. ფოსტა"
                                    autofocus
                                />
                                @error('data.email')
                                    <div class="invalid-feedback d-block">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-6">
                                <label for="password" class="form-label">პაროლი</label>
                                <input
                                    id="password"
                                    type="password"
                                    wire:model.defer="data.password"
                                    class="form-control @if ($errors->has('data.password')) is-invalid @endif"
                                    placeholder="შეიყვანე პაროლი"
                                />
                                @error('data.password')
                                    <div class="invalid-feedback d-block">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="my-8 d-flex justify-content-between align-items-center">
                                <div class="form-check mb-0 ms-2">
                                    <input class="form-check-input" type="checkbox" id="remember-me" wire:model="data.remember" />
                                    <label class="form-check-label" for="remember-me">დამიმახსოვრე</label>
                                </div>

                                @if (filament()->hasPasswordReset())
                                    <a href="{{ filament()->getRequestPasswordResetUrl() }}">
                                        <p class="mb-0">დაგავიწყდა პაროლი?</p>
                                    </a>
                                @endif
                            </div>

                            <button type="submit" class="btn btn-primary d-grid w-100" wire:loading.attr="disabled">
                                <span wire:loading.remove wire:target="authenticate">შესვლა</span>
                                <span wire:loading wire:target="authenticate">მიმდინარეობს შესვლა...</span>
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
