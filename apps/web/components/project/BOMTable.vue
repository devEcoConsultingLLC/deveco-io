<script setup lang="ts">
defineProps<{
  components: Array<{
    name: string;
    quantity: number;
    priceUsd?: string;
    purchaseUrl?: string;
    notes?: string;
  }>;
}>();
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-border">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-border bg-muted">
          <th class="px-4 py-3 text-left font-semibold text-foreground">Component</th>
          <th class="px-4 py-3 text-center font-semibold text-foreground">Qty</th>
          <th class="px-4 py-3 text-right font-semibold text-foreground">Price</th>
          <th class="px-4 py-3 text-right font-semibold text-foreground">Subtotal</th>
          <th class="px-4 py-3 text-left font-semibold text-foreground">Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in components"
          :key="i"
          class="border-b border-border last:border-0"
        >
          <td class="px-4 py-3 font-medium text-foreground">
            <a v-if="item.purchaseUrl" :href="item.purchaseUrl" target="_blank" class="text-primary hover:underline">
              {{ item.name }}
            </a>
            <span v-else>{{ item.name }}</span>
          </td>
          <td class="px-4 py-3 text-center text-muted-foreground">{{ item.quantity }}</td>
          <td class="px-4 py-3 text-right text-muted-foreground">
            {{ item.priceUsd ? `$${item.priceUsd}` : '—' }}
          </td>
          <td class="px-4 py-3 text-right text-muted-foreground">
            {{ item.priceUsd ? `$${(Number(item.priceUsd) * item.quantity).toFixed(2)}` : '—' }}
          </td>
          <td class="px-4 py-3 text-muted-foreground">{{ item.notes || '—' }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="border-t border-border bg-muted">
          <td colspan="3" class="px-4 py-3 text-right font-semibold text-foreground">Total</td>
          <td class="px-4 py-3 text-right font-semibold text-foreground">
            ${{ components.reduce((sum, c) => sum + (Number(c.priceUsd || 0) * c.quantity), 0).toFixed(2) }}
          </td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
