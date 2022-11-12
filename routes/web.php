<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('home');
})->name('home');

Route::get('/FCFS', function () {
    return view('fcfs');
})->name('fcfs');
Route::get('/SJN', function () {
    return view('sjn');
})->name('sjn');
Route::get('/SRT', function () {
    return view('srt');
})->name('srt');
Route::get('/RR', function () {
    return view('rr');
})->name('rr');
Route::get('/PE', function () {
    return view('pe');
})->name('pe');
Route::get('/PD', function () {
    return view('pd');
})->name('pd');