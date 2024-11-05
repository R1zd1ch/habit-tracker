'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';

export default function SetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    // Отправьте пароль на сервер для сохранения в базе данных
    try {
      const response = await fetch('/api/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        // Пароль успешно установлен
        alert('Пароль установлен');
        // Перенаправьте пользователя на домашнюю страницу
        window.location.href = '/';
      } else {
        alert('Ошибка при установке пароля');
      }
    } catch (error) {
      console.error(error);
      alert('Произошла ошибка');
    }
  };

  return (
    <div>
      <h1>Установите пароль</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Установить пароль</button>
      </form>
    </div>
  );
}
