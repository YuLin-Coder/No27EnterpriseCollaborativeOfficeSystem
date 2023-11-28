package com.justerdu.io.base.vo;

import java.util.List;

public class Page<T> {

    private int current = 1;
    private int previous = 0;
    private int next = 0;
    private int total = 1;
    private long count = 0;
    private int size = 10;
    private boolean hasPrev = false;
    private boolean hasNext = false;

    private String orderBy;
    private String order;
    private List<T> list;


    public Page() {

    }

    public Page(int size) {
        setSize(size);
    }

    public Page(int current, int size) {
        setSize(size);
        setCurrent(current);
    }

    public Page(List<T> list, long count, int current, int size, String orderBy, String order) {
        this.list = list;
        this.current = current;
        this.count = count;
        this.size = size;
        this.orderBy = orderBy;
        this.order = order;
        this.total = count == 0 ? 1 : (int) Math.ceil((double) count / size);
        if (current > this.total) {
            this.current = this.total;
        }
        if (current < 1) {
            this.current = 1;
        }
        if (current == 1) {
            this.hasPrev = false;
        } else {
            this.hasPrev = true;
            this.previous = this.current - 1;
        }
        if (this.current < this.total) {
            this.hasNext = true;
            this.next = this.current + 1;
        } else {
            this.hasNext = false;
        }
    }


    public Page(List<T> list, int current, int size) {
        this.current = current;
        this.size = size;
        this.list = list;
    }

    public Page(List<T> list, long count, int current, int size) {
        this(list, count, current, size, null, null);
    }

    public void setPage(Page page) {
        this.current = page.getCurrent();
        this.previous = page.getPrevious();
        this.next = page.getNext();
        this.total = page.getTotal();
        this.count = page.getCount();
        this.size = page.getSize();
        this.hasPrev = page.isHasPrev();
        this.hasNext = page.isHasNext();
        this.orderBy = page.orderBy;
        this.order = page.order;
    }

    public int getCurrent() {
        return current;
    }

    public void setCurrent(int current) {
        this.current = current;
    }

    public boolean isHasNext() {
        return hasNext;
    }

    public void setHasNext(boolean hasNext) {
        this.hasNext = hasNext;
    }

    public boolean isHasPrev() {
        return hasPrev;
    }

    public void setHasPrev(boolean hasPrev) {
        this.hasPrev = hasPrev;
    }

    public int getNext() {
        return next;
    }

    public void setNext(int next) {
        this.next = next;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public int getPrevious() {
        return previous;
    }

    public void setPrevious(int previous) {
        this.previous = previous;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int l) {
        this.total = l;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public List<T> getList() {
        return list;
    }

    public void setList(List<T> list) {
        this.list = list;
    }

    public String getOrderBy() {
        return orderBy;
    }

    public void setOrderBy(String orderBy) {
        this.orderBy = orderBy;
    }

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

}
