<?php

namespace api\models\coupon;

use Yii;
use yii\base\Model;
use api\models\coupon\Coupon;
use api\models\coupon\CouponUsage;
use yii\web\HttpException;

class CouponLogic extends Model
{
    public function exchange($code)
    {
        // 检查是否有该优惠券
        $coupon = Coupon::find()
            ->where(['coupon_code' => $code])
            ->one();
        
        if (is_null($coupon)) {
            throw new HttpException(420, '该优惠券码不存在，请检查后重新输入');
        }

        // 检查该券是否过期
        $now_time = date("y-m-d h:i:s");
        $expiration_time = $coupon->expiration_date;

        if (strtotime($now_time) > strtotime($expiration_time)) {
            throw new HttpException(421, '该优惠券码已过期');
        }
        // 检查本来是否有该券
        $couponUsage = CouponUsage::find()
            ->where(['coupon_id' => $coupon->id, 'customer_id' => Yii::$app->user->identity->id])
            ->count();

        // $time_used = 0;
        // foreach ($couponUsage as $item) {
            // if ($item->is_used === 2) {
                // $time_used += 1;
            // }
        // }

        // 如果超过使用次数 那么失败
        if ($couponUsage >= $coupon->users_per_customer) {
            throw new HttpException(422, '该优惠券的领取次数已到上限');
        }

        // 否则 领券成功 
        $model = new CouponUsage();
        $model->coupon_id = $coupon->id;
        $model->customer_id = Yii::$app->user->identity->id;
        $model->is_used = 1;
        if ($model->save()) {
            return true;
        } else {
            throw new HttpException(423, array_values($model->getFirstErrors())[0]);
        }
    }
}
