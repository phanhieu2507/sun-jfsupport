<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;

class CategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        Validator::extend('without_spaces', function ($attr, $value) {
            return preg_match('/^\S*$/u', $value);
        });

        return [
            'category_name' => 'string|required|without_spaces|unique:categories,category_name',
        ];
    }

    public function messages()
    {
        return [
            'category_name.without_spaces' => 'カテゴリ名はスペースが含まれていません。',
            'category_name.unique' => 'このカテゴリ名は存在しています',
        ];
    }
}
