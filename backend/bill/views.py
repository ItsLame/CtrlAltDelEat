from orders.models import Item
from bill.models import Bill
from bill.serializers import BillSerializer
from rest_framework import generics
from rest_framework import permissions
from django.db.models import Sum


class GenerateBillView(generics.ListCreateAPIView):
    """
    generate bill for a table and order
    """
    serializer_class = BillSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Item.objects.all()
        table_num = self.request.GET.get('tableNumber', None)

        queryset = queryset.filter(tableNumber=table_num).values('orderNo').annotate(total_cost=Sum('cost'))
        orderNoList = []

        for item in queryset:
            Bill.objects.update_or_create(
                tableNumber=table_num,
                orderNo=item['orderNo'],
                defaults={"totalPrice": item['total_cost']}
            )
            orderNoList.append(item['orderNo'])

        # change item status from served to ready-to-pay
        items = Item.objects.filter(tableNumber=table_num)
        items.update(status='ready-to-pay')

        bill = Bill.objects.filter(orderNo__in=orderNoList)
        return bill
