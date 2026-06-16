<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->username,
            'email' => $this->when($request->user()?->id === $this->id || $request->user()?->isAdmin(), $this->email),
            'role' => $this->role,
            'avatar' => $this->avatar,
            'bio' => $this->bio,
            'phone' => $this->when($request->user()?->id === $this->id || $request->user()?->isAdmin(), $this->phone),
            'website' => $this->website,
            'is_active' => $this->when($request->user()?->isAdmin(), $this->is_active),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
